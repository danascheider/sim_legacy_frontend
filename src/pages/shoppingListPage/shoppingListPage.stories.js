import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
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

export const HappyPath = () => <ShoppingListPage />

HappyPath.story = {
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
        const newTitle = req.body.shopping_list.title
        const returnData = shoppingListUpdateData1
        returnData['title'] = newTitle

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/3`, (req, res, ctx) => {
        const newTitle = req.body.shopping_list.title
        const returnData = shoppingListUpdateData2
        returnData['title'] = newTitle

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      })
    ]
  }
}

// When the user has shopping lists but there's an error when they try to update

export const UpdateListNotFound = () => <ShoppingListPage />

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
        const newTitle = req.body.shopping_list.title
        const returnData = shoppingListUpdateData2
        returnData['title'] = newTitle

        return res(
          ctx.status(404),
          ctx.json({ error: 'Shopping list id=3 not found' })
        )
      })
    ]
  }
}

// When the list can't be updated (422 from API)

export const UpdateUnprocessableEntity = () => <ShoppingListPage />

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
          ctx.json({ errors: { title: ['cannot be blank'] } })
        )
      }),
      rest.patch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/3`, (req, res, ctx) => {
        const newTitle = req.body.shopping_list.title
        const returnData = shoppingListUpdateData2
        returnData['title'] = newTitle

        return res(
          ctx.status(422),
          ctx.json({ errors: { title: ['is already taken'] } })
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
