import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import { inventoryListUpdateData } from './storyData'
import { token, games, emptyGames, allInventoryLists, profileData } from '../../sharedTestData'
import {
  removeOrAdjustItemsOnListDestroy,
  removeOrAdjustItemOnItemDestroy,
  findListByListItem,
  findAggregateList,
  adjustListItem
} from '../../sharedTestUtilities'
import InventoryPageContent from './inventoryPageContent'

export default { title: 'InventoryPageContent' }

/*
 *
 * When all goes well and there are inventory lists for the selected game
 *
 */

export const HappyPath = () => (
  <AppProvider overrideValue={{ profileData, token: 'xxxxxx' }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider overrideValue={{ inventoryLists: allInventoryLists.filter(list => list.game_id === games[0].id), inventoryListLoadingState: 'done' }}>
        <InventoryPageContent />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

HappyPath.parameters = {
  msw: [
    rest.patch(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      const listId = parseInt(req.params.id)
      const returnData = inventoryListUpdateData
      returnData.title = req.body.inventory_list.title
      returnData.id = listId

      return res(
        ctx.status(200),
        ctx.json(returnData)
      )
    }),
    // This will blow up if you try to delete both list items because it doesn't
    // account for the fact that the aggregate list would be removed too in that
    // case.
    rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      const listId = parseInt(req.params.id)
      const regularList = allInventoryLists.find(list => list.id === listId)
      const items = regularList.list_items
      
      const newAggregateList = removeOrAdjustItemsOnListDestroy(allInventoryLists[0], items)

      if (newAggregateList === null) {
        return res(
          ctx.status(204)
          )
        } else {
        return res(
          ctx.status(200),
          ctx.json(newAggregateList)
        )
      }
    })
  ]
}

/*
 *
 * When all goes well and the selected game has no inventory lists
 *
 */

export const NoLists = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPageContent />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

NoLists.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([])
      )
    })
  ]
}

/*
 *
 * When the user has no games
 *
 */

export const NoGames = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games: emptyGames, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPageContent />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

/*
 *
 * When the requested game is not found - there should be no visible
 * content in Storybook for this story.
 *
 */

export const GameNotFound = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPageContent />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

GameNotFound.parameters = {
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
 * When the page is in an error state - there should be no visible content
 * for this story as these error responses are handled at the page level by
 * displaying a flash message
 *
 */

export const ErrorState = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPageContent />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

ErrorState.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ errors: ['Something went horribly wrong'] })
      )
    })
  ]
}

/*
 *
 * When the page is still loading
 *
 */

export const Loading = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider overrideValue={{ inventoryListLoadingState: 'loading' }}>
        <InventoryPageContent />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)
