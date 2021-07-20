import React, { useEffect, useRef, useCallback } from 'react'
import { YELLOW } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import { gameLoadingStates } from '../../contexts/gamesContext'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import Game from '../../components/game/game'
import GameCreateForm from '../../components/gameCreateForm/gameCreateForm'
import GameEditForm from '../../components/gameEditForm/gameEditForm'
import Loading from '../../components/loading/loading'
import styles from './gamesPage.module.css'

const { LOADING, DONE, ERROR } = gameLoadingStates

const GamesPage = () => {
  const {
    flashProps,
    flashVisible
  } = useAppContext()

  const {
    games,
    gameLoadingState,
    gameEditFormVisible,
    gameEditFormProps,
    setGameEditFormVisible
  } = useGamesContext()

  const formRef = useRef(null)

  const formRefContains = el => formRef.current && (formRef.current === el || formRef.current.contains(el))

  const hideForm = useCallback(e => {
    if (!e || e.key === 'Escape' || !formRefContains(e.target)) setGameEditFormVisible(false)
  }, [setGameEditFormVisible])

  useEffect(() => {
    window.addEventListener('keyup', hideForm)

    return () => window.removeEventListener('keyup', hideForm)
  }, [hideForm])

  return(
    <DashboardLayout title='Your Games'>
      <div className={styles.root}>
        {flashVisible && <FlashMessage {...flashProps} />}
        {gameEditFormVisible && <div className={styles.overlay} onClick={hideForm}><GameEditForm elementRef={formRef} {...gameEditFormProps} /></div>}
        {games && games.length === 0 && gameLoadingState === DONE && <p className={styles.noGames}>You have no games.</p>}
        <GameCreateForm disabled={gameLoadingState === LOADING || gameLoadingState === ERROR} />
        {games && games.length > 0 && gameLoadingState === DONE && <div className={styles.games}>
          {games.map(({ id, name, description }) => <Game key={name} gameId={id} name={name} description={description} />)}
        </div>}
        {gameLoadingState === LOADING && <Loading type='bubbles' className={styles.loading} color={YELLOW.schemeColorDarkest} height='15%' width='15%' />}
      </div>
    </DashboardLayout>
  )
}

export default GamesPage
