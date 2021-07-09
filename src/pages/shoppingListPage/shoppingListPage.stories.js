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
  adjustMasterListItem,
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

HappyPath.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.post(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 3'
        const returnData = [{ id: 32, user_id: 24, title: title, master: false, list_items: [] }]

        return res(
          ctx.status(201),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 1'
        const listId = Number(req.params.id)
        const returnData = { id: listId, user_id: 24, title: title, master: false, list_items: []}

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        const listId = Number(req.params.id)
        const regularList = shoppingLists.find(list => list.id === listId)
        const items = regularList.list_items

        const newMasterList = removeOrAdjustItemsOnListDestroy(shoppingLists[0], items)

        if (newMasterList === null) {
          return res(
            ctx.status(204)
          )
        } else {
          return res(
            ctx.status(200),
            ctx.json(newMasterList)
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
        const masterListItem = shoppingLists[0].list_items.find(item => item.description === existingItem.description)
        adjustMasterListItem(masterListItem, deltaQuantity, existingItem.notes, newItem.notes)

        return res(
          ctx.status(200),
          ctx.json([masterListItem, newItem])
        )
      }),
      rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
        const itemId = Number(req.params.id)
        const list = findListByListItem(shoppingLists, itemId)
        const item = list.list_items.find(listItem => listItem.id === itemId)
        const masterListItem = shoppingLists[0].list_items.find(listItem => listItem.description.toLowerCase() === item.description.toLowerCase())
        removeOrAdjustItemOnItemDestroy(masterListItem, item)

        if (masterListItem) {
          return res(
            ctx.status(200),
            ctx.json(masterListItem)
          )
        } else {
          return res(
            ctx.status(204)
          )
        }
      })
    ]
  }
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

ResourceNotFound.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.post(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 3'
        const returnData = [{ id: 32, user_id: 24, title: title, master: false, list_items: [] }]

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
}

/*
 *
 * When the list can't be updated because of a 422 error from the API,
 * or the user attempts to create a list with invalid data.
 * 
 */

export const UnprocessableEntity = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

UnprocessableEntity.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
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
            master_list: {
              id: 93,
              title: 'Master',
              master: true,
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
    ]
  }
}

/*
 *
 * When the user has no shopping lists
 * 
 */

export const Empty = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

Empty.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(emptyShoppingLists)
        )
      }),
      rest.post(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 3'
        const returnData = [
          { id: 33, user_id: 24, title: 'Master', master: true, list_items: [] },
          { id: 32, user_id: 24, title: title, master: false, list_items: [] }
        ]

        return res(
          ctx.status(201),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        const listId = Number(req.params.id)
        const title = req.body.shopping_list.title || 'My List 2'
        const returnData = { id: listId, user_id: 24, title, master: false, list_items: [] }

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(204)
        )
      })
    ]
  }
}

// When the API data is loading

export const Loading = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider overrideValue={{ shoppingListLoadingState: 'loading' }}>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

Loading.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(emptyShoppingLists)
        )
      })
    ]
  }
}

// When there is an error with the API response

export const ErrorState = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

ErrorState.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(500)
        )
      })
    ]
  }
}
