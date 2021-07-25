import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import {
  shoppingLists,
  shoppingListUpdateData,
  removeOrAdjustItemsOnListDestroy,
  removeOrAdjustItemOnItemDestroy,
  addOrCombineListItem,
  findListByListItem,
  adjustAggregateListItem
} from './storyData'
import { token, games, emptyGames, profileData } from '../../sharedTestData'
import ShoppingListsPageContent from './shoppingListsPageContent'

export default { title: 'ShoppingListsPageContent' }

/*
 *
 * When all toes well and there are shopping lists for the selected game
 *
 */

export const HappyPath = () => (
  <AppProvider overrideValue={{ profileData, token: 'xxxxxx' }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingLists }}>
        <ShoppingListsPageContent />
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)

HappyPath.parameters = {
  msw: [
    rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      const listId = Number(req.params.id)
      const returnData = shoppingListUpdateData
      returnData.title = req.body.shopping_list.title
      returnData.id = listId

      return res(
        ctx.status(200),
        ctx.json(returnData)
      )
    })
//     rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
//       const listId = Number(req.params.id)
//       const regularList = shoppingLists.find(list => list.id === listId)
//       const items = regularList.list_items
      
//       const newAggregateList = removeOrAdjustItemsOnListDestroy(shoppingLists[0], items)

//       if (newAggregateList === null) {
//         return res(
//           ctx.status(204)
//           )
//         } else {
//         return res(
//           ctx.status(200),
//           ctx.json(newAggregateList)
//         )
//       }
//     }),
//     rest.post(`${backendBaseUri}/shopping_lists/:shopping_list_id/shopping_list_items`, (req, res, ctx) => {
//       const listId = Number(req.params.shopping_list_id)
//       const list = shoppingLists.find(shoppingList => shoppingList.id === listId)
//       const regularListItem = addOrCombineListItem(list, req.body.shopping_list_item)
//       const aggregateListItem = addOrCombineListItem(shoppingLists[0], req.body.shopping_list_item)

//       return res(
//         ctx.status(200),
//         ctx.json([aggregateListItem, regularListItem])
//       )
//     }),
//     rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
//       const itemId = Number(req.params.id)
//       const list = findListByListItem(shoppingLists, itemId)
//       const existingItem = list.list_items.find(item => item.id === itemId)
//       const newItem = { ...existingItem, ...req.body.shopping_list_item }
//       const deltaQuantity = newItem.quantity - existingItem.quantity
//       const aggregateListItem = shoppingLists[0].list_items.find(item => item.description === existingItem.description)
//       const newAggregateListItem = adjustAggregateListItem(aggregateListItem, deltaQuantity, existingItem.notes, newItem.notes)

//       return res(
//         ctx.status(200),
//         ctx.json([newAggregateListItem, newItem])
//       )
//     }),
//     rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
//       const itemId = Number(req.params.id)
//       const list = findListByListItem(shoppingLists, itemId)
//       const item = list.list_items.find(listItem => listItem.id === itemId)
//       const aggregateListItem = shoppingLists[0].list_items.find(listItem => listItem.description.toLowerCase() === item.description.toLowerCase())
//       removeOrAdjustItemOnItemDestroy(aggregateListItem, item)

//       if (aggregateListItem) {
//         return res(
//           ctx.status(200),
//           ctx.json(aggregateListItem)
//         )
//       } else {
//         return res(
//           ctx.status(204)
//         )
//       }
//     })
  ]
}

/*
 *
 * When all goes well and the selected game has no shopping lists
 *
 */

export const NoLists = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider>
        <ShoppingListsPageContent />
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)

NoLists.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
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
      <ShoppingListsProvider>
        <ShoppingListsPageContent />
      </ShoppingListsProvider>
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
      <ShoppingListsProvider>
        <ShoppingListsPageContent />
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)

GameNotFound.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
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
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider>
        <ShoppingListsPageContent />
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)

ErrorState.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
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
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingListLoadingState: 'loading' }}>
        <ShoppingListsPageContent />
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)
