import React from 'react'
import { YELLOW } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import { LOADING, DONE, ERROR } from '../../utils/loadingStates'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import Game from '../../components/game/game'
import GameCreateForm from '../../components/gameCreateForm/gameCreateForm'
import Loading from '../../components/loading/loading'
import LoadingError from '../../components/loadingError/loadingError'
import styles from './gamesPage.module.css'

const GamesPage = () => {
  const {
    setFlashVisible,
    modalVisible,
    modalAttributes
  } = useAppContext()

  const {
    games,
    gameLoadingState
  } = useGamesContext()

  return(
    <DashboardLayout title='Your Games'>
      {modalVisible && <modalAttributes.Tag {...modalAttributes.props} />}
      <div className={styles.root}>
        <FlashMessage />
        {games && games.length === 0 && gameLoadingState === DONE && <p className={styles.noGames}>You have no games.</p>}
        {gameLoadingState === DONE && <GameCreateForm disabled={gameLoadingState === LOADING || gameLoadingState === ERROR} />}
        {games && games.length > 0 && gameLoadingState === DONE && <div className={styles.games}>
          {games.map(({ id, name, description }) => <Game key={name} gameId={id} name={name} description={description} />)}
        </div>}
        {gameLoadingState === LOADING && <Loading type='bubbles' className={styles.loading} color={YELLOW.schemeColorDarkest} height='15%' width='15%' />}
        {gameLoadingState === ERROR && <LoadingError modelName='games' />}
      </div>
    </DashboardLayout>
  )
}

export default GamesPage
