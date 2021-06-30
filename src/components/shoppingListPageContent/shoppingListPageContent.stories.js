import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { DashboardProvider } from '../../contexts/dashboardContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import {
  profileData,
  emptyShoppingLists,
  shoppingLists,
  shoppingListUpdateData1,
  shoppingListUpdateData2
} from './storyData'
import ShoppingListPageContent from './shoppingListPageContent'

export default { title: 'ShoppingListPageContent' }

export const HappyPath = () => (
  <DashboardProvider overrideValue={{ profileData, token: 'xxxxxx' }}>
    <ShoppingListProvider>
      <ShoppingListPageContent />
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

export const Loading = () => (
  <DashboardProvider overrideValue={{ profileData, token: 'xxxxxx' }}>
    <ShoppingListProvider overrideValue={{ shoppingListLoadingState: 'loading' }}>
      <ShoppingListPageContent />
    </ShoppingListProvider>
  </DashboardProvider>
)

Loading.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({})
        )
      })
    ]
  }
}
