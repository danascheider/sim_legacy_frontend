
import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import {
  token,
  profileData,
  games,
  allInventoryLists
} from '../../sharedTestData'
import InventoryPage from './inventoryPage'

export default { title: 'InventoryPage' }

export const HappyPath = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

HappyPath.parameters = {
  msw: [
    // This request retrieves a list of inventory lists for a given game, (if the game
    // exists and belongs to the authenticated user). For the purpose of Storybook, we
    // assume the user is authenticated and these are all their games.
    rest.get(`${backendBaseUri}/games/:game_id/inventory_lists`, (req, res, ctx) => {
      // Find the game whose inventory lists have been requested in the `games` array,
      // which represents all the games belonging to the logged-in user.
      const gameId = parseInt(req.params.game_id)
      const game = games.find(g => g.id === gameId)

      if (game) {
        // If the game is found, get its inventory lists out of the allInventoryLists array.
        // This will return an array (which could be empty or not). The new array will then
        // be returned from the API with a 200 response.
        const lists = allInventoryLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      } else {
        // If the game whose lists were requested doesn't exist, the API will return a 404
        // error. This will happen if the user manually changes the query string `game_id`
        // param to an ID that doesn't exist, or if the user attempts to retrieve shopping
        // lists for a game that has been destroyed on another device/browser without
        // refreshing the page first.
        return res(
          ctx.status(404)
        )
      }
    })
  ]
}
