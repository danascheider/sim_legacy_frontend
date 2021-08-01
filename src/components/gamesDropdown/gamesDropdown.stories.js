import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { token, profileData, emptyGames, games } from '../../sharedTestData'
import GamesDropdown from './gamesDropdown'

export default { title: 'GamesDropdown' }

/*
 *
 * When there are a couple of games on the list and all of their
 * names fit easily
 *
 */

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <GamesDropdown />
    </GamesProvider>
  </AppProvider>
)

/*
 *
 * When there is a scrollbar inside the dropdown
 *
 */

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

/*
 *
 * When there are no games to choose from
 *
 */

export const NoGames = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games: emptyGames }}>
      <GamesDropdown />
    </GamesProvider>
  </AppProvider>
)
