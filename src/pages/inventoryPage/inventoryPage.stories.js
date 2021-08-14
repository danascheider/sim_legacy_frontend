
import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import {
  token,
  profileData,
  emptyGames,
  games,
  emptyInventoryLists,
  allInventoryLists
} from '../../sharedTestData'
import InventoryPage from './inventoryPage'

export default { title: 'InventoryPage' }

/* 
 * 
 * When the user is logged in, has inventory lists, and the inventory
 * lists are able to be created or updated without incident. Also tests that,
 * when a user assigns a blank title and the API response returns a default
 * one, the title first stays blank then updates to the default one when the
 * response comes back.
 * 
 */

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
        // param to an ID that doesn't exist, or if the user attempts to retrieve inventory
        // lists for a game that has been destroyed on another device/browser without
        // refreshing the page first.
        return res(
          ctx.status(404)
        )
      }
    })
  ]
}

/*
 *
 * When the user has no games
 *
 */

export const NoGames = () => {
  return(
    <AppProvider overrideValue={{ profileData, token }}>
      <GamesProvider overrideValue={{ games: emptyGames, gameLoadingState: 'done' }}>
        <InventoryListsProvider>
          <InventoryPage />
        </InventoryListsProvider>
      </GamesProvider>
    </AppProvider>
  )
}


// This is the only story where I'll define handlers for creating a game and
// fetching its (empty) inventory lists, since it's easy to just say all requests
// for inventory lists for this story will return an empty array.
NoGames.parameters = {
  msw: [
    rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
      const name = req.body.game.name

      return res(
        ctx.status(201),
        ctx.json({
          id: Math.floor(Math.random() * 10000),
          user_id: profileData.id,
          description: null,
          name
        })
      )
    }),
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(emptyInventoryLists)
      )
    })
  ]
}

/*
 *
 * When the requested game doesn't exist or doesn't belong to
 * the authenticated user
 *
 */

export const GameNotFoundOnLoad = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

GameNotFoundOnLoad.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    })
  ]
}

/*
 *
 * When the requested game has loaded and then been deleted on
 * another device or browser, attempting to create an inventory list
 * for that game will result in a 404. This is an edge case.
 *
 */

export const GameNotFoundOnCreate = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

GameNotFoundOnCreate.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const lists = allInventoryLists.filter(list => list.game_id === gameId)

      return res(
        ctx.status(200),
        ctx.json(lists)
      )
    }),
    rest.post(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    rest.patch(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    })
  ]
}

/*
 *
 * When the game has no inventory lists
 * 
 */

export const NoLists = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider overrideValue={{ inventoryLists: emptyInventoryLists, inventoryListLoadingState: 'done' }}>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

/*
 *
 * When the API data is loading
 *
 */

export const Loading = () => {
  const inventoryLists = allInventoryLists.filter(list => list.game_id === games[0].id)

  return(
    <AppProvider overrideValue={{ profileData, token }}>
      <GamesProvider overrideValue={{ games }}>
        <InventoryListsProvider overrideValue={{ inventoryLists, inventoryListLoadingState: 'loading' }}>
          <InventoryPage />
        </InventoryListsProvider>
      </GamesProvider>
    </AppProvider>
  )
}

/*
 *
 * When there is an error with the API response
 *
 */

export const ErrorState = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

ErrorState.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(500)
      )
    })
  ]
}
