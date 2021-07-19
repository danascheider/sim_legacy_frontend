import React from 'react'
import { profileData, token, emptyGames } from '../../sharedTestData'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import Game from './game'

export default { title: 'Game' }

export const Default = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games: emptyGames }}>
      <Game gameId={4} name='My Game 1' description='My first game, idk' />
    </GamesProvider>
  </AppProvider>
)

export const NoDescription = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games: emptyGames }}>
      <Game gameId={4} name='My Game 1' description={null} />
    </GamesProvider>
  </AppProvider>
)
