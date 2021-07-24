import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { token, profileData, games } from '../../sharedTestData'
import GamesDropdown from './gamesDropdown'

export default { title: 'GamesDropdown' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <GamesDropdown />
    </GamesProvider>
  </AppProvider>
)

const longGameList = [...games]
longGameList.push(
  { id: 688, user_id: 24, name: 'My Game 3' },
  { id: 1257, user_id: 24, name: 'My Game 4' },
  { id: 349, user_id: 24, name: 'My Game 5' }
)

export const WithLongGameList = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games: longGameList }}>
      <GamesDropdown />
    </GamesProvider>
  </AppProvider>
)
