import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import ShoppingListCreateForm from './shoppingListCreateForm'

const performCreateShoppingList = e => { e.preventDefault() }

const listItems = [
  {
    id: 1,
    list_id: 1,
    description: 'Ebony sword',
    quantity: 3,
    notes: 'Love those ebony swords'
  },
  {
    id: 2,
    list_id: 1,
    description: 'Necklace',
    quantity: 4,
    notes: 'Any unenchanted necklaces for enchanting'
  },
  {
    id: 3,
    list_id: 1,
    description: 'Iron ingot',
    quantity: 400,
    notes: 'Building Lakeview Manor takes some iron'
  }
]

const shoppingLists = [
  {
    id: 1,
    title: 'All Items',
    aggregate: true,
    list_items: listItems
  },
  {
    id: 1,
    title: 'My List 2',
    aggregate: false,
    list_items: listItems
  }
]

export default { title: 'ShoppingListCreateForm' }

export const Enabled = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx' }}>
    <ShoppingListProvider overrideValue={{ performCreateShoppingList, shoppingLists }}>
      <ShoppingListCreateForm disabled={false} />
    </ShoppingListProvider>
  </AppProvider>
)

export const Disabled = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx' }}>
    <ShoppingListProvider overrideValue={{ performCreateShoppingList, shoppingLists }}>
      <ShoppingListCreateForm disabled />
    </ShoppingListProvider>
  </AppProvider>
)
