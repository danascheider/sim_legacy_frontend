import React from 'react'
import {
  emptyShoppingLists,
  shoppingLists
} from './storyData'
import ShoppingListPageContent from './shoppingListPageContent'

const preventDefault = e => e.preventDefault()

export default { title: 'ShoppingListPageContent' }

export const Default = () => (
  <ShoppingListPageContent lists={shoppingLists} onSubmitEditForm={preventDefault} />
)

export const NoLists = () => (
  <ShoppingListPageContent lists={emptyShoppingLists} onSubmitEditForm={preventDefault} />
)
