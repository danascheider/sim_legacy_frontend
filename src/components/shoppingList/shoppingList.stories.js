import React from 'react'
import { rest } from 'msw'
import { PINK } from '../../utils/colorSchemes'
import { backendBaseUri } from '../../utils/config'
import { ColorProvider } from '../../contexts/colorContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import { AppProvider } from '../../contexts/appContext'
import ShoppingList from './shoppingList'

const regularListItems = [
  {
    id: 1,
    list_id: 2,
    description: 'Ebony sword',
    quantity: 3,
    notes: 'Love those ebony swords'
  },
  {
    id: 2,
    list_id: 2,
    description: 'Necklace',
    quantity: 4,
    notes: 'Any unenchanted necklaces for enchanting'
  }
]

const aggregateListItems = [
  {
    id: 3,
    list_id: 1,
    description: 'Ebony sword',
    quantity: 3,
    notes: 'Love those ebony swords'
  },
  {
    id: 4,
    list_id: 1,
    description: 'Necklace',
    quantity: 4,
    notes: 'Any unenchanted necklaces for enchanting'
  }
]

const shoppingLists = [
  {
    id: 1,
    user_id: 24,
    title: 'All Items',
    aggregate: true,
    list_items: aggregateListItems
  },
  {
    id: 2,
    user_id: 24,
    title: 'My List 1',
    aggregate: false,
    list_items: regularListItems
  }
]

export default { title: 'ShoppingList' }

export const Default = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListsProvider overrideValue={{ performShoppingListUpdate: (a, b, c = null, d = null) => {}, shoppingLists }}>
        <ShoppingList
          listId={2}
          title='My List 1'
        />
      </ShoppingListsProvider>
    </ColorProvider>
  </AppProvider>
)

Default.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(
          [
            {
              id: 1,
              title: 'All Items',
              aggregate: true,
              list_items: aggregateListItems
            },
            {
              id: 2,
              title: 'My List 1',
              aggregate: false,
              list_items: regularListItems
            }
          ]
        )
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      const itemId = Number(req.params.id)
      const regularItem = regularListItems.find(item => item.id === itemId)
      const aggregateListItem = aggregateListItems.find(item => item.description === regularItem.description)
      const newQty = req.body.shopping_list_item.quantity

      const returnData = [
        {
          id: aggregateListItem.id,
          list_id: 1,
          description: aggregateListItem.description,
          quantity: newQty,
          notes: aggregateListItem.notes
        },
        {
          id: itemId,
          list_id: 2,
          description: regularItem.description,
          quantity: newQty,
          notes: regularItem.notes
        }
      ]
      return res(
        ctx.status(200),
        ctx.json(returnData)
      )
    })
  ]
}

export const NotEditable = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListsProvider overrideValue={{ shoppingLists }}>
        <ShoppingList
          title='All Items'
          listId={1}
          canEdit={false}
        />
      </ShoppingListsProvider>
    </ColorProvider>
  </AppProvider>
)

NotEditable.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            title: 'All Items',
            aggregate: true,
            list_items: aggregateListItems
          },
          {
            id: 2,
            title: 'My List 1',
            aggregate: false,
            list_items: regularListItems
          }
        ])
      )
    })
  ]
}

const emptyShoppingLists = [
  {
    id: 1,
    title: 'All Items',
    user_id: 24,
    list_items: [],
    aggregate: true
  },
  {
    id: 2,
    title: 'Severin Manor',
    user_id: 24,
    list_items: [],
    aggregate: false
  }
]

export const EmptyList = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListsProvider overrideValue={{ shoppingLists: emptyShoppingLists }}>
        <ShoppingList
          title='Severin Manor'
          listId={2}
          canEdit={true}
        />
      </ShoppingListsProvider>
    </ColorProvider>
  </AppProvider>
)

export const EmptyAggregateList = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListsProvider overrideValue={{ shoppingLists: emptyShoppingLists }}>
        <ShoppingList
          title='All Items'
          listId={1}
          canEdit={false}
        />
      </ShoppingListsProvider>
    </ColorProvider>
  </AppProvider>
)
