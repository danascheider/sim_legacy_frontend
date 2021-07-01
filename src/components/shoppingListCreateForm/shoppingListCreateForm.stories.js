import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import ShoppingListCreateForm from './shoppingListCreateForm'

const performCreateShoppingList = e => { e.preventDefault() }

const listItems = [
  {
    id: 1,
    shopping_list_id: 1,
    description: 'Ebony sword',
    quantity: 3,
    notes: 'Love those ebony swords'
  },
  {
    id: 2,
    shopping_list_id: 1,
    description: 'Necklace',
    quantity: 4,
    notes: 'Any unenchanted necklaces for enchanting'
  },
  {
    id: 3,
    shopping_list_id: 1,
    description: 'Iron ingot',
    quantity: 400,
    notes: 'Building Lakeview Manor takes some iron'
  }
]

export default { title: 'ShoppingListCreateForm' }

export const Enabled = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx' }}>
    <ShoppingListProvider overrideValue={{ performCreateShoppingList }}>
      <ShoppingListCreateForm disabled={false} />
    </ShoppingListProvider>
  </AppProvider>
)

Enabled.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: 1,
              title: 'My List 1',
              master: false,
              shopping_list_items: listItems
            },
            {
              id: 2,
              title: 'My List 2',
              master: true,
              shopping_list_items: listItems
            }
          ])
        )
      })
    ]
  }
}

export const Disabled = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx' }}>
    <ShoppingListProvider overrideValue={{ performCreateShoppingList }}>
      <ShoppingListCreateForm disabled />
    </ShoppingListProvider>
  </AppProvider>
)

Disabled.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: 1,
              title: 'My List 1',
              master: false,
              shopping_list_items: listItems
            },
            {
              id: 2,
              title: 'My List 2',
              master: true,
              shopping_list_items: listItems
            }
          ])
        )
      })
    ]
  }
}


