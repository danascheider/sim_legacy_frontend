import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { token, profileData, games } from '../../sharedTestData'
import GamesDropdown from './gamesDropdown'

export default { title: 'GamesDropdown' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <GamesDropdown onSelectGame={id => { /* noop */ }} />
    </GamesProvider>
  </AppProvider>
)
