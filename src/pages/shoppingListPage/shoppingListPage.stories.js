import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { DashboardProvider } from '../../contexts/dashboardContext'
import {
  userData,
  emptyShoppingLists,
  shoppingLists,
  shoppingListUpdateData1,
  shoppingListUpdateData2
} from './storyData'
import ShoppingListPage from './shoppingListPage'
export default { title: 'ShoppingListPage' }

// When the user has shopping lists, and the ones that
// are allowed to be updated can be updated successfully

export const HappyPath = () => <DashboardProvider overrideValue={{ profileData: userData }}><ShoppingListPage /></DashboardProvider>

HappyPath.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/1`, (req, res, ctx) => {
        const newTitle = req.body.shopping_list.title
        const returnData = shoppingListUpdateData1
        returnData.title = newTitle

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/3`, (req, res, ctx) => {
        const newTitle = req.body.shopping_list.title
        const returnData = shoppingListUpdateData2
        returnData.title = newTitle

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      })
    ]
  }
}

// When the user enters a blank title, the API will change the title to "My List N". This
// story is to verify that the UI updates with the saved title when the API call finishes.

export const UpdateDefaultTitle = () => <DashboardProvider><ShoppingListPage /></DashboardProvider>

UpdateDefaultTitle.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(userData)
        )
      }),
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/1`, (req, res, ctx) => {
        const returnData = shoppingListUpdateData1
        returnData.title = 'My List 1'

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/3`, (req, res, ctx) => {
        const returnData = shoppingListUpdateData1
        returnData.title = 'My List 2'

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      })
    ]
  }
}

// When the user has shopping lists but there's an error when they try to update

export const UpdateListNotFound = () => <DashboardProvider><ShoppingListPage /></DashboardProvider>

UpdateListNotFound.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(userData)
        )
      }),
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
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

// When the list can't be updated (422 from API)

export const UpdateUnprocessableEntity = () => <DashboardProvider><ShoppingListPage /></DashboardProvider>

UpdateUnprocessableEntity.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(userData)
        )
      }),
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
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

// When the user has no shopping lists

export const Empty = () => <DashboardProvider><ShoppingListPage /></DashboardProvider>

Empty.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(userData)
        )
      }),
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(emptyShoppingLists)
        )
      })
    ]
  }
}

// When the API data is loading

export const Loading = () => <DashboardProvider><ShoppingListPage /></DashboardProvider>

Loading.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(userData)
        )
      }),
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.delay(1000 * 60 * 60 * 60)
        )
      })
    ]
  }
}

// When there is an error with the API response

export const ErrorState = () => <DashboardProvider><ShoppingListPage /></DashboardProvider>

ErrorState.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(userData)
        )
      }),
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(500)
        )
      })
    ]
  }
}
