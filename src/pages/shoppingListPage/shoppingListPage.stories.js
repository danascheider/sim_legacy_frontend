import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { DashboardProvider } from '../../contexts/dashboardContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import {
  userData,
  emptyShoppingLists,
  shoppingLists,
  shoppingListUpdateData1,
  shoppingListUpdateData2
} from './storyData'
import ShoppingListPage from './shoppingListPage'

export default { title: 'ShoppingListPage' }

const dashboardContextOverrideValue = {
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
  <DashboardProvider overrideValue={dashboardContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </DashboardProvider>
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
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/32`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 1'
        const returnData = { id: 32, user_id: 24, title: title, master: false, shopping_list_items: []}

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/1`, (req, res, ctx) => {
        const returnData = shoppingListUpdateData1
        returnData.title = req.body.shopping_list.title || 'My List 1'

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/3`, (req, res, ctx) => {
        const returnData = shoppingListUpdateData2
        returnData.title = req.body.shopping_list.title || 'My List 2'

        return res(
          ctx.status(200),
          ctx.json(returnData)
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

export const UpdateListNotFound = () => (
  <DashboardProvider overrideValue={dashboardContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </DashboardProvider>
)

UpdateListNotFound.story = {
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
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/32`, (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({ error: 'Shopping list id=32 not found' })
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/1`, (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({ error: 'Shopping list id=1 not found' })
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/3`, (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({ error: 'Shopping list id=3 not found' })
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

export const UpdateUnprocessableEntity = () => (
  <DashboardProvider overrideValue={dashboardContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </DashboardProvider>
)

UpdateUnprocessableEntity.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.post(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => () => {
        return res(
          ctx.status(422),
          ctx.json({ errors: { title: ['can only include alphanumeric characters and spaces'] } })
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/1`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({ errors: { title: ['is already taken'] } })
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/3`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({ errors: { title: ['is already taken'] } })
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
  <DashboardProvider overrideValue={dashboardContextOverrideValue}>
    <ShoppingListProvider overrideValue={{ shoppingLists: emptyShoppingLists, shoppingListLoadingState: 'done' }}>
      <ShoppingListPage />
    </ShoppingListProvider>
  </DashboardProvider>
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
        const returnData = [{ id: 32, user_id: 24, title: title, master: false, shopping_list_items: [] }]

        return res(
          ctx.status(201),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/32`, (req, res, ctx) => {
        const title = req.body.shopping_list.title || 'My List 2'
        const returnData = { id: 32, user_id: 24, title, master: false, shopping_list_items: [] }

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      })
    ]
  }
}

// When the API data is loading

export const Loading = () => (
  <DashboardProvider overrideValue={dashboardContextOverrideValue}>
    <ShoppingListProvider overrideValue={{ shoppingListLoadingState: 'loading' }}>
      <ShoppingListPage />
    </ShoppingListProvider>
  </DashboardProvider>
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
  <DashboardProvider overrideValue={dashboardContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </DashboardProvider>
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
