import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import {
  profileData,
  shoppingLists,
  shoppingListUpdateData,
  removeOrAdjustItemsOnListDestroy,
  removeOrAdjustItemOnItemDestroy,
  addOrCombineListItem,
  findListByListItem,
  adjustMasterListItem
} from './storyData'
import ShoppingListPageContent from './shoppingListPageContent'

export default { title: 'ShoppingListPageContent' }

export const HappyPath = () => (
  <AppProvider overrideValue={{ profileData, token: 'xxxxxx' }}>
    <ShoppingListProvider overrideValue={{ shoppingLists }}>
      <ShoppingListPageContent />
    </ShoppingListProvider>
  </AppProvider>
)

HappyPath.parameters = {
  msw: [
    rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
      const listId = Number(req.params.id)
      const returnData = shoppingListUpdateData
      returnData.title = req.body.shopping_list.title
      returnData.id = listId

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
      const listId = Number(req.params.shopping_list_id)
      const list = shoppingLists.find(shoppingList => shoppingList.id === listId)
      const regularListItem = addOrCombineListItem(list, req.body.shopping_list_item)
      const masterListItem = addOrCombineListItem(shoppingLists[0], req.body.shopping_list_item)

      return res(
        ctx.status(200),
        ctx.json([masterListItem, regularListItem])
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      const itemId = Number(req.params.id)
      const list = findListByListItem(shoppingLists, itemId)
      const existingItem = list.list_items.find(item => item.id === itemId)
      const newItem = { ...existingItem, ...req.body.shopping_list_item }
      const deltaQuantity = newItem.quantity - existingItem.quantity
      const masterListItem = shoppingLists[0].list_items.find(item => item.description === existingItem.description)
      const newMasterListItem = adjustMasterListItem(masterListItem, deltaQuantity, existingItem.notes, newItem.notes)

      return res(
        ctx.status(200),
        ctx.json([newMasterListItem, newItem])
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

export const Loading = () => (
  <AppProvider overrideValue={{ profileData, token: 'xxxxxx' }}>
    <ShoppingListProvider overrideValue={{ shoppingListLoadingState: 'loading' }}>
      <ShoppingListPageContent />
    </ShoppingListProvider>
  </AppProvider>
)

Loading.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([])
      )
    })
  ]
}
