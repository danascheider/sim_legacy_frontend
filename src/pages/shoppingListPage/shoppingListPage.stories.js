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

// When the user has shopping lists, and the ones that
// are allowed to be updated can be updated successfully

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
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/1`, (req, res, ctx) => {
        const returnData = shoppingListUpdateData1
        returnData.title = req.body.shopping_list.title

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/3`, (req, res, ctx) => {
        const returnData = shoppingListUpdateData2
        returnData.title = req.body.shopping_list.title

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

export const UpdateDefaultTitle = () => (
  <DashboardProvider overrideValue={dashboardContextOverrideValue}>
    <ShoppingListProvider>
      <ShoppingListPage />
    </ShoppingListProvider>
  </DashboardProvider>
)

UpdateDefaultTitle.story = {
  parameters: {
    msw: [
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
