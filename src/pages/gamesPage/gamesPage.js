import React from 'react'
import { YELLOW } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import Game from '../../components/game/game'
import Loading from '../../components/loading/loading'
import styles from './gamesPage.module.css'

const GamesPage = () => {
  const {
    flashProps,
    flashVisible
  } = useAppContext()

  const { games, gameLoadingState } = useGamesContext()

  return(
    <DashboardLayout title='Your Games'>
      <div className={styles.root}>
        {flashVisible && <FlashMessage {...flashProps} />}
        {games && games.length === 0 && gameLoadingState === 'done' && <p className={styles.noGames}>You have no games.</p>}
        {games && games.length > 0 && gameLoadingState === 'done' && <div className={styles.games}>
          {games.map(({ name, description }) => <Game key={name} name={name} description={description} />)}
        </div>}
        {gameLoadingState === 'loading' && <Loading type='bubbles' className={styles.loading} color={YELLOW.schemeColorDarkest} height='15%' width='15%' />}
      </div>
    </DashboardLayout>
  )
}

export default GamesPage
