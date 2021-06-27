import React from 'react'
import {
  emptyShoppingLists,
  shoppingLists
} from './storyData'
import ShoppingListPageContent from './shoppingListPageContent'

const noop = () => {}

export default { title: 'ShoppingListPageContent' }

export const Default = () => (
  <ShoppingListPageContent lists={shoppingLists} onSubmitEditForm={noop} />
)

export const NoLists = () => (
  <ShoppingListPageContent lists={emptyShoppingLists} onSubmitEditForm={noop} />
)
