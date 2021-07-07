import React from 'react'
import { rest } from 'msw'
import { PINK } from '../../utils/colorSchemes'
import { backendBaseUri } from '../../utils/config'
import { ColorProvider } from '../../contexts/colorContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import { AppProvider } from '../../contexts/appContext'
import ShoppingList from './shoppingList'

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

export default { title: 'ShoppingList' }

export const Default = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListProvider overrideValue={{ performShoppingListUpdate: (a, b, c = null, d = null) => {} }}>
        <ShoppingList
          listId={1}
          title='My List 1'
        />
      </ShoppingListProvider>
    </ColorProvider>
  </AppProvider>
)

Default.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(
            [
              {
                id: 1,
                title: 'My List 1',
                master: false,
                list_items: listItems
              },
              {
                id: 2,
                title: 'My List 2',
                master: true,
                list_items: listItems
              }
            ]
          )
        )
      })
    ]
  }
}

export const NotEditable = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListProvider>
        <ShoppingList
          title='Master'
          listId={1}
          canEdit={false}
        />
      </ShoppingListProvider>
    </ColorProvider>
  </AppProvider>
)

NotEditable.story = {
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
              list_items: listItems
            },
            {
              id: 2,
              title: 'My List 2',
              master: true,
              list_items: listItems
            }
          ])
        )
      })
    ]
  }
}

export const EmptyMasterList = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', setShouldRedirectTo: () => null }}>
    <ColorProvider colorScheme={PINK}>
      <ShoppingListProvider>
        <ShoppingList
          title='Master'
          listId={1}
          canEdit={false}
        />
      </ShoppingListProvider>
    </ColorProvider>
  </AppProvider>
)

EmptyMasterList.story = {
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
              list_items: []
            },
            {
              id: 2,
              title: 'My List 2',
              master: true,
              list_items: []
            }
          ])
        )
      })
    ]
  }
}
