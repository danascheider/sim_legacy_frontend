import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import {
  userData,
  emptyShoppingLists,
  shoppingLists
} from './storyData'
import ShoppingListPage from './shoppingListPage'
export default { title: 'ShoppingListPage' }

export const Default = () => <ShoppingListPage />

Default.story = {
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
      })
    ]
  }
}

// When the user has no shopping lists

export const Empty = () => <ShoppingListPage />

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

export const Loading = () => <ShoppingListPage />

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

export const ErrorState = () => <ShoppingListPage />

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
