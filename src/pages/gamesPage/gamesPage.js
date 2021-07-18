import React, { useState, useEffect, useRef } from 'react'
import { isStorybook } from '../../utils/isTestEnv'
import { fetchGames } from '../../utils/simApi'
import { YELLOW } from '../../utils/colorSchemes'
import { useAppContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import Game from '../../components/game/game'
import Loading from '../../components/loading/loading'
import styles from './gamesPage.module.css'
import paths from '../../routing/paths'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const GamesPage = () => {
  const {
    token,
    logOutAndRedirect,
    setShouldRedirectTo,
    displayFlash,
    flashProps,
    flashVisible
  } = useAppContext()

  const [games, setGames] = useState(null)
  const [gameLoadingState, setGameLoadingState] = useState(LOADING)

  const mountedRef = useRef(true)

  useEffect(() => {
    if (!token && !isStorybook) {
      setShouldRedirectTo(paths.login)
      mountedRef.current = false
    } else if (token) {
      fetchGames(token)
        .then(resp => resp.json())
        .then(data => {
          if (data && !data.errors) {
            if (mountedRef.current) {
              setGames(data)
              setGameLoadingState(DONE)
            }
          } else {
            const message = data && data.errors ? 'Internal ServerError: ' + data.errors[0] : 'No game data returned from SIM'
            throw new Error(message)
          }
        })
        .catch(err => {
          if (err.code === 401) {
            logOutAndRedirect(paths.login, () => mountedRef.current = false)
            // Don't set the loading state because it's redirecting anyway
          } else {
            if (process.env.NODE_ENV === 'development') console.error('Unexpected error fetching games: ', err.message)

            if (mountedRef.current) {
              setGameLoadingState(ERROR)
              displayFlash('error', "There was an error loading your games. It may have been on our end. We're sorry!")
            }
          }
        })
    }
    
    return () => mountedRef.current = false
  }, [token, logOutAndRedirect, setShouldRedirectTo, displayFlash])

  return(
    <DashboardLayout title='Your Games'>
      <div className={styles.root}>
        {flashVisible && <FlashMessage {...flashProps} />}
        {games && games.length === 0 && gameLoadingState === DONE && <p className={styles.noGames}>You have no games.</p>}
        {games && games.length > 0 && gameLoadingState === DONE && <div className={styles.games}>
          {games.map(({ name, description }) => <Game key={name} name={name} description={description} />)}
        </div>}
        {gameLoadingState === LOADING && <Loading type='bubbles' className={styles.loading} color={YELLOW.schemeColorDarkest} height='15%' width='15%' />}
      </div>
    </DashboardLayout>
  )
}

export default GamesPage
