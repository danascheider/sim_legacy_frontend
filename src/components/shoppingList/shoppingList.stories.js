import React from 'react'
import { rest } from 'msw'
import { PINK } from '../../utils/colorSchemes'
import { backendBaseUri } from '../../utils/config'
import { ColorProvider } from '../../contexts/colorContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
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

const masterListItems = [
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
    title: 'Master',
    master: true,
    list_items: masterListItems
  },
  {
    id: 2,
    user_id: 24,
    title: 'My List 1',
    master: false,
    list_items: regularListItems
  }
]

export default { title: 'ShoppingList' }

export const Default = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListProvider overrideValue={{ performShoppingListUpdate: (a, b, c = null, d = null) => {}, shoppingLists }}>
        <ShoppingList
          listId={2}
          title='My List 1'
        />
      </ShoppingListProvider>
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
              title: 'Master',
              master: true,
              list_items: masterListItems
            },
            {
              id: 2,
              title: 'My List 1',
              master: false,
              list_items: regularListItems
            }
          ]
        )
      )
    }),
    rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      const itemId = Number(req.params.id)
      const regularItem = regularListItems.find(item => item.id === itemId)
      const masterListItem = masterListItems.find(item => item.description === regularItem.description)
      const newQty = req.body.shopping_list_item.quantity

      const returnData = [
        {
          id: masterListItem.id,
          list_id: 1,
          description: masterListItem.description,
          quantity: newQty,
          notes: masterListItem.notes
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
      <ShoppingListProvider overrideValue={{ shoppingLists }}>
        <ShoppingList
          title='Master'
          listId={1}
          canEdit={false}
        />
      </ShoppingListProvider>
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
            title: 'Master',
            master: true,
            list_items: masterListItems
          },
          {
            id: 2,
            title: 'My List 1',
            master: false,
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
    title: 'Master',
    user_id: 24,
    list_items: [],
    master: true
  },
  {
    id: 2,
    title: 'Severin Manor',
    user_id: 24,
    list_items: [],
    master: false
  }
]

export const EmptyList = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListProvider overrideValue={{ shoppingLists: emptyShoppingLists }}>
        <ShoppingList
          title='Severin Manor'
          listId={2}
          canEdit={true}
        />
      </ShoppingListProvider>
    </ColorProvider>
  </AppProvider>
)

export const EmptyMasterList = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListProvider overrideValue={{ shoppingLists: emptyShoppingLists }}>
        <ShoppingList
          title='Master'
          listId={1}
          canEdit={false}
        />
      </ShoppingListProvider>
    </ColorProvider>
  </AppProvider>
)
