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
import { fetchGames, createGame } from '../utils/simApi'
import { useAppContext } from '../hooks/contexts'
import paths from '../routing/paths'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const gameLoadingStates = { LOADING, DONE, ERROR }

const GamesContext = createContext()

const GamesProvider = ({ children, overrideValue = {} }) => {
  const { token, logOutAndRedirect, displayFlash } = useAppContext()

  const [games, setGames] = useState(overrideValue.games || [])
  const [gameLoadingState, setGameLoadingState] = useState(overrideValue.gameLoadingState || LOADING)

  const mountedRef = useRef(true)
  const gamesOverridden = useRef(false)

  // Check if undefined or null because an empty array would evaluate to false

  if (overrideValue.games !== undefined && overrideValue.games !== null) {
    // Use this as the initial value only so that the games can be
    // updated when we interact in Storybook or other tests
    delete overrideValue.games
    gamesOverridden.current = true
  }

  const fetchUserGames = useCallback(() => {
    if (token && !gamesOverridden.current) {
      fetchGames(token)
        .then(resp => resp.json())
        .then(data => {
          if (data && !data.errors) {
            if (mountedRef.current) {
              setGames(data)
              !overrideValue.gameLoadingState && setGameLoadingState(DONE)
            }
          } else {
            const message = data && data.errors ? `Internal Server Error: ${data.errors[0]}` : 'No game data returned from SIM'
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
              setGameLoadingState(ERROR)
              displayFlash('error', "There was an error loading your games. It may have been on our end. We're sorry!")
            }
          }
        })
    }
  }, [token, overrideValue.gameLoadingState, displayFlash, logOutAndRedirect])

  const performGameCreate = useCallback((attrs, success = null, error = null) => {
    createGame(token, attrs)
      .then(resp => resp.json())
      .then(data => {
        if (data && !data.errors) {
          if (mountedRef.current) {
            const newGames = [...games]
            newGames.unshift(data)
            setGames(newGames)
          }

          success && success()
        } else if (data && data.errors) {
          if (data.errors.filter(msg => msg.match(/^(Name|Description)/)).length === data.errors.length) {
            displayFlash('error', data.errors, `${data.errors.length} error(s) prevented your game from being created:`)
            success && success()
          } else {
            throw new Error(`Internal Server Error: ${data.errors[0]}`)
          }
        } else {
          // Something unexpected happened and we don't know what.
          throw new Error("There was an unexpected error creating your new game. Unfortunately, we don't know more than that yet. We're sorry!")
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => mountedRef.current = false)
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Error creating game: ', err)

          displayFlash('error', "Something unexpected happened while trying to create your game. Unfortunately, we don't know more than that yet. We're working on it!")

          error && error()
        }
      })
  }, [token, games, displayFlash, logOutAndRedirect])

  const value = {
    games,
    gameLoadingState,
    performGameCreate,
    ...overrideValue
  }

  useEffect(() => {
    fetchUserGames()
    return () => mountedRef.current = false
  }, [fetchUserGames])

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
    performGameCreate: PropTypes.func
  })
}

export { GamesContext, GamesProvider, gameLoadingStates }
