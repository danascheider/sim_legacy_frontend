import React, { useEffect, useCallback } from 'react'
import { YELLOW } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import { gameLoadingStates } from '../../contexts/gamesContext'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import Game from '../../components/game/game'
import GameCreateForm from '../../components/gameCreateForm/gameCreateForm'
import ModalGameForm from '../../components/modalGameForm/modalGameForm'
import Modal from '../../components/modal/modal'
import Loading from '../../components/loading/loading'
import styles from './gamesPage.module.css'

const { LOADING, DONE, ERROR } = gameLoadingStates

const GamesPage = () => {
  const {
    flashProps,
    flashVisible,
    setFlashVisible
  } = useAppContext()

  const {
    games,
    gameLoadingState,
    gameEditFormVisible,
    gameEditFormProps,
    setGameEditFormVisible
  } = useGamesContext()

  const hideForm = useCallback(e => {
    if (!e || e.key === 'Escape') setGameEditFormVisible(false)
  }, [setGameEditFormVisible])

  useEffect(() => {
    window.addEventListener('keyup', hideForm)

    return () => window.removeEventListener('keyup', hideForm)
  }, [hideForm])

  useEffect(() => {
    // Flash message props will be set when the `GamesContext` handles the error.
    // Displaying the flash message in the context provider left the possibility
    // that this flash message would be displayed on pages other than this one,
    // where we don't want it.
    if (gameLoadingState === ERROR) setFlashVisible(true)
  }, [gameLoadingState, setFlashVisible])

  return(
    <DashboardLayout title='Your Games'>
      <div className={styles.root}>
        {flashVisible && Object.keys(flashProps).length && <FlashMessage {...flashProps} />}
        {gameEditFormVisible && 
          <Modal title='Edit Game' setModalVisible={setGameEditFormVisible}>
            <ModalGameForm type='edit' {...gameEditFormProps} />
          </Modal>
        }
        {games && games.length === 0 && gameLoadingState === DONE && <p className={styles.noGames}>You have no games.</p>}
        {gameLoadingState === DONE && <GameCreateForm disabled={gameLoadingState === LOADING || gameLoadingState === ERROR} />}
        {games && games.length > 0 && gameLoadingState === DONE && <div className={styles.games}>
          {games.map(({ id, name, description }) => <Game key={name} gameId={id} name={name} description={description} />)}
        </div>}
        {gameLoadingState === LOADING && <Loading type='bubbles' className={styles.loading} color={YELLOW.schemeColorDarkest} height='15%' width='15%' />}
      </div>
    </DashboardLayout>
  )
}

export default GamesPage
