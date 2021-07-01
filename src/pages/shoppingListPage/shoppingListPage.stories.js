import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import {
  userData,
  emptyShoppingLists,
  shoppingLists
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
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

HappyPath.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.post(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 3'
        const returnData = [{ id: 32, user_id: 24, title: title, master: false, shopping_list_items: [] }]

        return res(
          ctx.status(201),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/:id`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 1'
        const listId = Number(req.params.id)
        const returnData = { id: listId, user_id: 24, title: title, master: false, shopping_list_items: []}

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.delete(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            master_list: {
              id: 489,
              title: 'Master',
              master: true,
              user_id: 24,
              shopping_list_items: []
            }
          })
        )
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

export const ListNotFound = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </AppProvider>
)

ListNotFound.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.post(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 3'
        const returnData = [{ id: 32, user_id: 24, title: title, master: false, shopping_list_items: [] }]

        return res(
          ctx.status(201),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/:id`, (req, res, ctx) => {
        const listId = Number(req.params.id)

        return res(
          ctx.status(404)
        )
      }),
      rest.delete(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/:id`, (req, res, ctx) => {
        const listId = Number(req.params.id)

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
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.post(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({ errors: ['Title can only include alphanumeric characters and spaces'] })
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({ errors: ['Title is already taken'] })
        )
      }),
      rest.delete(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            master_list: {
              id: 93,
              title: 'Master',
              master: true,
              user_id: 24,
              shopping_list_items: []
            }
          })
        )
      })
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
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(emptyShoppingLists)
        )
      }),
      rest.post(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 3'
        const returnData = [
          { id: 33, user_id: 24, title: 'Master', master: true, shopping_list_items: [] },
          { id: 32, user_id: 24, title: title, master: false, shopping_list_items: [] }
        ]

        return res(
          ctx.status(201),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/:id`, (req, res, ctx) => {
        const listId = Number(req.params.id)
        const title = req.body.shopping_list.title || 'My List 2'
        const returnData = { id: listId, user_id: 24, title, master: false, shopping_list_items: [] }

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.delete(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/:id`, (req, res, ctx) => {
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
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
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
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(500)
        )
      })
    ]
  }
}
