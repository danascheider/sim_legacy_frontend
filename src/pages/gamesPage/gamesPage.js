import React, { useState, useEffect, useRef } from 'react'
import { fetchGames } from '../../utils/simApi'
import { YELLOW } from '../../utils/colorSchemes'
import { useAppContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import Loading from '../../components/loading/loading'
import styles from './gamesPage.module.css'
import paths from '../../routing/paths'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const GamesPage = () => {
  const { token, logOutAndRedirect } = useAppContext()

  const [games, setGames] = useState(null)
  const [gameLoadingState, setGameLoadingState] = useState(LOADING)

  const mountedRef = useRef(true)

  useEffect(() => {
    fetchGames(token)
      .then(resp => resp.json())
      .then(data => {
        if (data && !data.errors) {
          setGames(data)
          setGameLoadingState(DONE)
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

          setGameLoadingState(ERROR)
        }
      })
    
    return () => mountedRef.current = false
  }, [token, logOutAndRedirect])

  return(
    <DashboardLayout title='Your Games'>
      <div className={styles.root}>
        {games && games.length === 0 && gameLoadingState === DONE && <div className={styles.noGames}>You have no games.</div>}
        {games && games.length > 0 && gameLoadingState === DONE && <ul className={styles.gameContent}>
          {games.map(({ name }) => (
            <li key={name} className={styles.game}>{name}</li>
        ))}
        </ul>}
        {gameLoadingState === LOADING && <Loading type='bubbles' className={styles.loading} color={YELLOW.schemeColorDarkest} height='15%' width='15%' />}
      </div>
    </DashboardLayout>
  )
}

export default GamesPage
