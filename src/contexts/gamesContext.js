/*
 *
 * For more information about contexts and how they are used in SIM,
 * visit the docs on SIM contexts (/docs/contexts.md)
 * 
 * This context makes heavy use of the SIM API. The requests it makes are
 * mediated through the simApi module (/src/utils/simApi.js). To get information
 * about the API, its requirements, and its responses, visit the docs:
 * https://github.com/danascheider/skyrim_inventory_management/tree/main/docs/api
 *
 */

import { createContext, useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  fetchGames,
  createGame,
  updateGame,
  destroyGame
} from '../utils/simApi'
import { useAppContext } from '../hooks/contexts'
import paths from '../routing/paths'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const gameLoadingStates = { LOADING, DONE, ERROR }

const GamesContext = createContext()

const GamesProvider = ({ children, overrideValue = {} }) => {
  const { token, logOutAndRedirect, setFlashProps } = useAppContext()

  const [games, setGames] = useState(overrideValue.games || [])
  const [gameLoadingState, setGameLoadingState] = useState(overrideValue.gameLoadingState || LOADING)

  const mountedRef = useRef(true)
  const gamesOverridden = useRef(false)

  if (overrideValue.games) {
    // Use this as the initial value only so that the games can be
    // updated when we interact in Storybook or other tests
    delete overrideValue.games
    gamesOverridden.current = true
  }

  const fetchUserGames = useCallback(() => {
    if (token && !gamesOverridden.current) {
      fetchGames(token)
        .then(({ status, json }) => {
          if (status === 200) {
            if (mountedRef.current) {
              setGames(json)
              !overrideValue.gameLoadingState && setGameLoadingState(DONE)
            }
          } else {
            const message = json.errors ? `Error ${status} when fetching games: ${json.errors}` : 'No game data returned from SIM'
            throw new Error(message)
          }
        })
        .catch(err => {
          if (err.code === 401) {
            logOutAndRedirect(paths.login, () => mountedRef.current = false)
            // Don't set the loading state because it's redirecting anyway
          } else {
            if (process.env.NODE_ENV === 'development') console.error('Unexpected error fetching games: ', err)

            if (mountedRef.current) {
              setFlashProps({
                type: 'error',
                message: "There was an error loading your games. It may have been on our end. We're sorry!"
              })

              setGameLoadingState(ERROR)
            }
          }
        })
    }
  }, [token, overrideValue.gameLoadingState, setFlashProps, logOutAndRedirect])

  const performGameCreate = useCallback((attrs, callbacks) => {
    const { onSuccess, onUnprocessableEntity, onUnauthorized, onInternalServerError } = callbacks

    createGame(token, attrs)
      .then(({ status, json }) => {
        if (status === 201) {
          if (mountedRef.current) {
            const newGames = [...games]
            newGames.unshift(json)
            setGames(newGames)
          }

          setFlashProps({
            type: 'success',
            message: 'Success! Your game has been created.'
          })

          onSuccess && onSuccess()
        } else if (status === 422) {
          setFlashProps({
            type: 'error',
            header: `${json.errors.length} error(s) prevented your game from being created:`,
            message: json.errors
          })

          onUnprocessableEntity && onUnprocessableEntity()
        } else {
          // Something unexpected happened and we don't know what.
          throw new Error(json.errors ? `Error ${status} when creating game: ${json.errors}` : `Error ${status} when creating game`)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Error creating game: ', err)

          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while creating your game. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, games, setFlashProps, logOutAndRedirect])

  const performGameUpdate = useCallback((gameId, attrs, callbacks) => {
    const { onSuccess, onUnprocessableEntity, onNotFound, onInternalServerError, onUnauthorized } = callbacks

    updateGame(token, gameId, attrs)
      .then(({ status, json }) => {
        if (status === 200) {
          if (mountedRef.current) {
            const newGames = games.map(game => parseInt(game.id) === parseInt(gameId) ? json : game)
            setGames(newGames)
            setFlashProps({ type: 'success', message: 'Success! Your game has been updated.' })
          }

          onSuccess && onSuccess()
        } else if (status === 422) {
          if (mountedRef.current) {
            setFlashProps({
              type: 'error',
              message: json.errors,
              header: `${json.errors.length} error(s) prevented your game from being updated:`
            })
          }

          onUnprocessableEntity && onUnprocessableEntity()
        } else {
          throw new Error(json.errors ? `Error ${status} while updating game: ${json.errors}` : `Error ${status} while updating game`)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error',
            message: "Oops! We couldn't find the game you wanted to update. Sorry! Try refreshing the page to solve this problem."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Error updating game: ', err)

          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to update your game. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, games, setFlashProps, logOutAndRedirect])

  const performGameDestroy = useCallback((gameId, callbacks) => {
    const { onSuccess, onUnauthorized, onInternalServerError } = callbacks

    destroyGame(token, gameId)
      .then(resp => {
        // If the game isn't found we should treat it as if it's been destroyed
        // and just remove it successfully
        if ((resp.status === 204 || resp.status === 404) && mountedRef.current) {
          const destroyedGame = games.find(game => parseInt(game.id) === parseInt(gameId))
          const gameIndex = games.indexOf(destroyedGame)

          const newGames = [...games]
          newGames.splice(gameIndex, 1)

          setGames(newGames)
          setFlashProps({
            type: 'success',
            message: 'Your game has been deleted.'
          })

          onSuccess && onSuccess()
        } else {
          throw new Error(`Error ${resp.status} while destroying game ${gameId}`)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Error destroying game: ', err)

          if (mountedRef.current) {
            setFlashProps({
              type: 'error',
              message: "Something unexpected happened while trying to delete your game. Unfortunately, we don't know more than that yet. We're working on it!"
            })
          }

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, games, logOutAndRedirect, setFlashProps])

  const value = {
    games,
    gameLoadingState,
    performGameCreate,
    performGameUpdate,
    performGameDestroy,
    ...overrideValue
  }

  useEffect(() => {
    mountedRef.current && fetchUserGames()
  }, [fetchUserGames])

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <GamesContext.Provider value={value}>
      {children}
    </GamesContext.Provider>
  )
}

GamesProvider.propTypes = {
  children: PropTypes.node.isRequired,
  overrideValue: PropTypes.shape({
    games: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      user_id: PropTypes.number,
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    })),
    gameLoadingState: PropTypes.oneOf([LOADING, DONE, ERROR]),
    performGameCreate: PropTypes.func,
    performGameUpdate: PropTypes.func,
    performGameDestroy: PropTypes.func
  })
}

export { GamesContext, GamesProvider, gameLoadingStates }
