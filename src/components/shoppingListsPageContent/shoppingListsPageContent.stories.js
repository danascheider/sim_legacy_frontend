import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import { shoppingListUpdateData } from './storyData'
import { token, games, emptyGames, allShoppingLists, profileData } from '../../sharedTestData'
import {
  removeOrAdjustItemsOnListDestroy,
  removeOrAdjustItemOnItemDestroy,
  findListByListItem,
  findAggregateList,
  adjustListItem
} from '../../sharedTestUtilities'
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
      <ShoppingListsProvider overrideValue={{ shoppingLists: allShoppingLists.filter(list => list.game_id === games[0].id) }}>
        <ShoppingListsPageContent />
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)

HappyPath.parameters = {
  msw: [
    rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      const listId = parseInt(req.params.id)
      const returnData = shoppingListUpdateData
      returnData.title = req.body.shopping_list.title
      returnData.id = listId

      return res(
        ctx.status(200),
        ctx.json(returnData)
      )
    }),
    // This will blow up if you try to delete both list items because it doesn't
    // account for the fact that the aggregate list would be removed too in that
    // case.
    rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      const listId = parseInt(req.params.id)
      const regularList = allShoppingLists.find(list => list.id === listId)
      const items = regularList.list_items
      
      const newAggregateList = removeOrAdjustItemsOnListDestroy(allShoppingLists[0], items)

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
    // This request adds a shopping list item to the shopping list requested, if that shopping
    // list exists and belongs to the authenticated user. For the purposes of Storybook, we
    // assume the user is authenticated and the `allShoppingLists` array represents all their
    // shopping lists for all their games.
    rest.post(`${backendBaseUri}/shopping_lists/:listId/shopping_list_items`, (req, res, ctx) => {
      // Find the shopping list the user wants to add the item to
      const listId = parseInt(req.params.listId)
      const regList = allShoppingLists.find(list => list.id === listId)

      if (regList) {
        // If the shopping list exists and the request params are valid, the API will
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
        const description = req.body.shopping_list_item.description
        const quantity = req.body.shopping_list_item.quantity || '1'

        // Description and quantity are both required and neither can be blank. The
        // quantity must be an integer as well. If the quantity is a decimal/float value
        // greater than 1, it will be truncated and treated as an integer. If the
        // quantity is non-numeric or less than 1, it is invalid.
        if (description && quantity && (typeof quantity === 'number' || quantity.match(/[1-9]+(\.\d+)?/))) {
          const regListItem = regList.list_items.find(item => item.description.toLowerCase() === description.toLowerCase())
          const notes = req.body.shopping_list_item.notes

          const aggregateList = findAggregateList(allShoppingLists, regList.game_id)
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
        // If the shopping list is not found, the API will return a 404.
        return res(
          ctx.status(404)
        )
      }
    }),
    // This request updates a shopping list item by ID, assuming the shopping list
    // item exists and belongs to the authenticated user. For the purposes of
    // Storybook, we assume the user is authenticated and the `allShoppingLists`
    // array represents all their lists for all their games.
    rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      // Find the list the item is on
      const itemId = parseInt(req.params.id)
      const regList = findListByListItem(allShoppingLists, itemId)

      if (regList) {
        // If the regular list exists, find the item and the aggregate list the item
        // is on. The corresponding item on that list will need to be updated as well.
        // Note that, for this story, incrementing and decrementing are the only way
        // to update an item - because there is no modal rendered in the story, the
        // edit form will not appear if you click the update link.
        const existingItem = regList.list_items.find(item => item.id === itemId)
        const aggregateList = findAggregateList(allShoppingLists, regList.game_id)
        const newItem = { ...existingItem, ...req.body.shopping_list_item }
        const quantity = parseInt(newItem.quantity)

        if (quantity > 0) {
          const deltaQuantity = quantity - existingItem.quantity
          const aggregateListItem = aggregateList.list_items.find(item => (
            item.description.toLowerCase() === existingItem.description.toLowerCase()
          ))

          adjustListItem(aggregateListItem, deltaQuantity, existingItem.notes, newItem.notes)

          return res(
            ctx.status(200),
            ctx.json([aggregateListItem, newItem])
          )
        } else {
          // If the quantity is less than 0, return a 422 error
          return res(
            ctx.status(422),
            ctx.json({ errors: ['Quantity must be greater than zero'] })
          )
        }
      } else {
        // Return a 404 error if the shopping list the item is on doesn't exist -
        // that means the item wasn't found in any list's array of list items
        return res(
          ctx.status(404)
        )
      }
    }),
    // This request deletes the requested shopping list item, if it exists and
    // belongs to the authenticated user. For the purposes of Storybook, we're
    // assuming that the user is authenticated and the `allShoppingLists` array
    // represents all their shopping lists for all their games.
    rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      // Find the item and the list it is on.
      const itemId = parseInt(req.params.id)
      const regList = findListByListItem(allShoppingLists, itemId)

      if (regList) {
        // If the list exists (i.e., if the item has been found on one of the
        // lists for that game), find the item itself.
        const item = regList.list_items.find(listItem => listItem.id === itemId)

        // Find the item on the aggregate list.
        const aggregateList = findAggregateList(allShoppingLists, regList.game_id)

        // This will blow up if `aggregateList` is `null` but because there are
        // aggregate lists hard-coded into the test data it would actually kind
        // of be good to know if that wasn't making it into here properly.
        let aggregateListItem = aggregateList.list_items.find(listItem => (
          listItem.description.toLowerCase() === item.description.toLowerCase()
        ))

        aggregateListItem = removeOrAdjustItemOnItemDestroy(aggregateListItem, item)

        if (aggregateListItem) {
          // If the aggregate list item has a higher quantity than the item destroyed,
          // meaning that there is another matching item on another shopping list for
          // the same game, then the adjusted aggregate list item will be returned from
          // the API.
          return res(
            ctx.status(200),
            ctx.json(aggregateListItem)
          )
        } else {
          // If the aggregate list item has a quantity equal to that of the item
          // destroyed (meaning there are no other matching items on any of that
          // game's othere lists), then it will be removed from the databasee and
          // the API will return a 204 No Content response.
          return res(
            ctx.status(204)
          )
        }
      } else {
        // If the object `regList` is null, it means that the list item wasn't
        // found in any list's array of list items. The list item doesn't exist
        // or doesn't belong to the authenticated user.
        return res(
          ctx.status(204)
        )
      }
    })
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
