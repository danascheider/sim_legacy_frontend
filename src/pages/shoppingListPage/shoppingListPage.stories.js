import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import {
  userData,
  emptyShoppingLists,
  shoppingLists,
  findListByListItem,
  adjustAggregateListItem,
  removeOrAdjustItemsOnListDestroy,
  removeOrAdjustItemOnItemDestroy
} from './storyData'
import ShoppingListPage from './shoppingListPage'

export default { title: 'ShoppingListPage' }

const appContextOverrideValue = {
  token: 'xxxxxx',
  profileData: userData
}

/* 
 * 
 * When the user is logged in, has shopping lists, and the shopping
 * lists are able to be created or updated without incident. Also tests that,
 * when a user assigns a blank title and the API response returns a default
 * one, the title first stays blank then updates to the default one when the
 * response comes back.
 * 
 */

export const HappyPath = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider overrideValue={{ shoppingLists }}>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

HappyPath.parameters = {
  msw: [
    rest.post(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      const title = req.body.shopping_list.title || 'My List 3'
      const returnData = [{ id: 32, user_id: 24, title: title, aggregate: false, list_items: [] }]

      return res(
        ctx.status(201),
        ctx.json(returnData)
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      const title = req.body.shopping_list.title || 'My List 1'
      const listId = Number(req.params.id)
      const returnData = { id: listId, user_id: 24, title: title, aggregate: false, list_items: []}

      return res(
        ctx.status(200),
        ctx.json(returnData)
      )
    }),
    rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      const listId = Number(req.params.id)
      const regularList = shoppingLists.find(list => list.id === listId)
      const items = regularList.list_items

      const newAggregateList = removeOrAdjustItemsOnListDestroy(shoppingLists[0], items)

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
    rest.post(`${backendBaseUri}/shopping_lists/:shopping_list_id/shopping_list_items`, (req, res, ctx) => {
      const description = req.body.shopping_list_item.description
      const quantity = Number(req.body.shopping_list_item.quantity || 1)
      const notes = req.body.shopping_list_item.notes

      const listId = Number(req.params.shopping_ist_id)

      const returnData = [
        {
          id: 57,
          list_id: 1,
          description: description,
          quantity: quantity,
          notes: notes
        },
        {
          id: 58,
          list_id: listId,
          description: description,
          quantity: quantity,
          notes: notes
        }
      ]

      return res(
        ctx.status(201),
        ctx.json(returnData)
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      const itemId = Number(req.params.id)
      const list = findListByListItem(shoppingLists, itemId)
      const existingItem = list.list_items.find(item => item.id === itemId)
      const newItem = { ...existingItem, ...req.body.shopping_list_item }
      const deltaQuantity = newItem.quantity - existingItem.quantity
      const aggregateListItem = shoppingLists[0].list_items.find(item => item.description === existingItem.description)
      adjustAggregateListItem(aggregateListItem, deltaQuantity, existingItem.notes, newItem.notes)

      return res(
        ctx.status(200),
        ctx.json([aggregateListItem, newItem])
      )
    }),
    rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      const itemId = Number(req.params.id)
      const list = findListByListItem(shoppingLists, itemId)
      const item = list.list_items.find(listItem => listItem.id === itemId)
      const aggregateListItem = shoppingLists[0].list_items.find(listItem => listItem.description.toLowerCase() === item.description.toLowerCase())
      removeOrAdjustItemOnItemDestroy(aggregateListItem, item)

      if (aggregateListItem) {
        return res(
          ctx.status(200),
          ctx.json(aggregateListItem)
        )
      } else {
        return res(
          ctx.status(204)
        )
      }
    })
  ]
}

/*
 *
 * When the user has shopping lists but there is an error when they try to update one
 * due to a 404 on the server side.
 * 
 */

export const ResourceNotFound = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

ResourceNotFound.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(shoppingLists)
      )
    }),
    rest.post(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      const title = req.body.shopping_list.title || 'My List 3'
      const returnData = [{ id: 32, user_id: 24, title: title, aggregate: false, list_items: [] }]

      return res(
        ctx.status(201),
        ctx.json(returnData)
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    rest.post(`${backendBaseUri}/shopping_lists/:shopping_list_id/shopping_list_items`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    })
  ]
}

/*
 *
 * When the list can't be updated because of a 422 error from the API,
 * or the user attempts to create a list with invalid data.
 * 
 */

export const UnprocessableEntity = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider overrideValue={{ shoppingLists }}>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

UnprocessableEntity.parameters = {
  msw: [
    rest.post(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      return res(
        ctx.status(422),
        ctx.json({ errors: ['Title can only include alphanumeric characters and spaces'] })
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(422),
        ctx.json({ errors: ['Title is already taken'] })
      )
    }),
    rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          aggregate_list: {
            id: 93,
            title: 'All Items',
            aggregate: true,
            user_id: 24,
            list_items: []
          }
        })
      )
    }),
    rest.post(`${backendBaseUri}/shopping_lists/:shopping_list_id/shopping_list_items`, (req, res, ctx) => {
      return res(
        ctx.status(422),
        ctx.json({ errors: ['Quantity is not a number'] })
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      return res(
        ctx.status(422),
        ctx.json({ errors: ['Quantity is required', 'Quantity is not a number'] })
      )
    }),
    rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      const itemId = Number(req.params.id)
      const list = findListByListItem(shoppingLists, itemId)
      const item = list.list_items.find(listItem => listItem.id === itemId)
      const aggregateListItem = shoppingLists[0].list_items.find(listItem => listItem.description.toLowerCase() === item.description.toLowerCase())
      removeOrAdjustItemOnItemDestroy(aggregateListItem, item)

      if (aggregateListItem) {
        return res(
          ctx.status(200),
          ctx.json(aggregateListItem)
        )
      } else {
        return res(
          ctx.status(204)
        )
      }
    })
  ]
}

/*
 *
 * When the user has no shopping lists
 * 
 */

export const Empty = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider overrideValue={{ shoppingLists: emptyShoppingLists }}>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

Empty.parameters = {
  msw: [
    rest.post(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      const title = req.body.shopping_list.title || 'My List 3'
      const returnData = [
        { id: 32, user_id: 24, title: 'All Items', aggregate: true, list_items: [] },
        { id: 33, user_id: 24, title: title, aggregate: false, list_items: [] }
      ]

      return res(
        ctx.status(201),
        ctx.json(returnData)
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      const listId = Number(req.params.id)
      const title = req.body.shopping_list.title || 'My List 2'
      const returnData = { id: listId, user_id: 24, title, aggregate: false, list_items: [] }

      return res(
        ctx.status(200),
        ctx.json(returnData)
      )
    }),
    rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(204)
      )
    }),
    rest.post(`${backendBaseUri}/shopping_lists/:shopping_list_id/shopping_list_items`, (req, res, ctx) => {
      const description = req.body.shopping_list_item.description
      const quantity = Number(req.body.shopping_list_item.quantity || 1)
      const notes = req.body.shopping_list_item.notes

      const listId = Number(req.params.shopping_ist_id)

      const returnData = [
        {
          id: 57,
          list_id: 32,
          description: description,
          quantity: quantity,
          notes: notes
        },
        {
          id: 58,
          list_id: listId,
          description: description,
          quantity: quantity,
          notes: notes
        }
      ]

      return res(
        ctx.status(201),
        ctx.json(returnData)
      )
    }),

  ]
}

// When the API data is loading

export const Loading = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider overrideValue={{ shoppingLists, shoppingListLoadingState: 'loading' }}>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

// When there is an error with the API response

export const ErrorState = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

ErrorState.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      return res(
        ctx.status(500)
      )
    })
  ]
}
