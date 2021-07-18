import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { profileData } from './testData'
import GameCreateForm from './gameCreateForm'

const token = 'xxxxxx'

export default { title: 'GameCreateForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games: [], performGameCreate: () => {} }}>
      <GameCreateForm disabled={false} />
    </GamesProvider>
  </AppProvider>
)

export const Disabled = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games: [] }}>
      <GameCreateForm disabled />
    </GamesProvider>
  </AppProvider>
)
