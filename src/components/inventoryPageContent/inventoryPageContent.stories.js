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
    }),
    // This request adds an inventory list item to the inventory list requested, if that inventory
    // list exists and belongs to the authenticated user. For the purposes of Storybook, we
    // assume the user is authenticated and the `allInventoryLists` array represents all their
    // inventory lists for all their games.
    rest.post(`${backendBaseUri}/inventory_lists/:listId/inventory_list_items`, (req, res, ctx) => {
      // Find the inventory list the user wants to add the item to
      const listId = parseInt(req.params.listId)
      const regList = allInventoryLists.find(list => list.id === listId)

      if (regList) {
        // If the inventory list exists and the request params are valid, the API will
        // do one of two things. If the params are valid and there is an existing item
        // on the same list with a matching description, it will update the existing item,
        // adding the quantity from the request params and concatenating notes values, if
        // any, so they are separated by `' -- '`. Then the API will find the matching
        // item on the aggregate list and update it as well.
        //
        // If the params are valid and there is no existing item with a matching
        // description on the same list, the API will create a new item on that list. Then,
        // it will check to see if there is already a matching item on the aggregate list.
        // If there is a matching item on the aggregate list, that item will be updated as
        // described above. If there is no matching item, a new one will be created with
        // the `notes` and `description` values from the request.
        const description = req.body.inventory_list_item.description
        const quantity = req.body.inventory_list_item.quantity || '1'

        // Description and quantity are both required and neither can be blank. The
        // quantity must be an integer as well. If the quantity is a decimal/float value
        // greater than 1, it will be truncated and treated as an integer. If the
        // quantity is non-numeric or less than 1, it is invalid.
        if (description && quantity && (typeof quantity === 'number' || quantity.match(/[1-9]+(\.\d+)?/))) {
          const regListItem = regList.list_items.find(item => item.description.toLowerCase() === description.toLowerCase())
          const notes = req.body.inventory_list_item.notes

          const aggregateList = findAggregateList(allInventoryLists, regList.game_id)
          const aggregateListItem = aggregateList.list_items.find(item => item.description.toLowerCase() === description.toLowerCase())

          if (regListItem) adjustListItem(regListItem, parseInt(quantity), regListItem.notes, notes)
          if (aggregateListItem) adjustListItem(aggregateListItem, parseInt(quantity), aggregateListItem.notes, notes)

          const defaultRegListItem = { id: Math.floor(Math.random() * 10000), list_id: regList.id, description, quantity }
          const defaultAggListItem = { id: Math.floor(Math.random() * 10000), list_id: aggregateList.id, description, quantity }

          // The API will return the updated aggregate list item along with the created or
          // updated list item from the regular list with a 200 status.
          const returnData = [aggregateListItem || defaultAggListItem, regListItem || defaultRegListItem]

          return res(
            ctx.status(200),
            ctx.json(returnData)
          )
        } else {
          const errors = []
          // Invalid values will result in a 422 error. This will approximate API
          // behaviour and error messages when a value is invalid.
          if (!quantity) errors.push('Quantity is required')
          if (quantity && !quantity.match(/[1-9]+(\.\d+)?/)) errors.push('Quantity must be a number')
          // There are no validations on description format, it's just required to be there.
          if (!description) errors.push('Description is required')

          return res(
            ctx.status(422),
            ctx.json({ errors })
          )
        }
      } else {
        // If the inventory list is not found, the API will return a 404.
        return res(
          ctx.status(404)
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
