import React from 'react'
import { rest } from 'msw'
import { PINK } from '../../utils/colorSchemes'
import { backendBaseUri } from '../../utils/config'
import { ColorProvider } from '../../contexts/colorContext'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import { token, games } from '../../sharedTestData'
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
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games }}>
      <ColorProvider colorScheme={PINK}>
        <ShoppingListsProvider overrideValue={{ performShoppingListUpdate: (a, b, c = null, d = null) => {}, shoppingLists }}>
          <ShoppingList
            listId={2}
            title='My List 1'
          />
        </ShoppingListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)

Default.parameters = {
  msw: [
    rest.patch(`${backendBaseUri}/shopping_lists/2`, (req, res, ctx) => {
      const title = req.body.shopping_list.title

      return res(
        ctx.status(200),
        ctx.json({
          ...shoppingLists[1],
          title
        })
      )
    }),
    // This does not capture the full logic around combining list items. It replaces the notes
    // value of an existing item with the notes value from the form. Although this logic is the
    // domain of the back end, it's worth commenting that the back end doesn't actually do it
    // quite this way.
    rest.post(`${backendBaseUri}/shopping_lists/:listId/shopping_list_items`, (req, res, ctx) => {
      const description = req.body.shopping_list_item.description
      const quantity = parseInt(req.body.shopping_list_item.quantity)
      const notes = req.body.shopping_list_item.notes


      const item = regularListItems.find(i => i.description.toLowerCase() === description.toLowerCase())
      const aggListItem = aggregateListItems.find(i => i.description.toLowerCase() === description.toLowerCase())

      if (item) {        
        const returnData = [
          {
            ...aggListItem,
            quantity: aggListItem.quantity + quantity,
            notes: notes
          },
          {
            ...item,
            quantity: item.quantity + quantity,
            notes: notes
          }
        ]

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      } else {
        const returnData = [
          {
            id: Math.floor(Math.random() * 10000),
            list_id: 1,
            description,
            quantity,
            notes
          },
          {
            id: Math.floor(Math.random() * 10000),
            list_id: 2,
            description,
            quantity,
            notes
          }
        ]
        
        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      }
    })
//     rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
//       const itemId = Number(req.params.id)
//       const regularItem = regularListItems.find(item => item.id === itemId)
//       const aggregateListItem = aggregateListItems.find(item => item.description === regularItem.description)
//       const newQty = req.body.shopping_list_item.quantity

//       const returnData = [
//         {
//           id: aggregateListItem.id,
//           list_id: 1,
//           description: aggregateListItem.description,
//           quantity: newQty,
//           notes: aggregateListItem.notes
//         },
//         {
//           id: itemId,
//           list_id: 2,
//           description: regularItem.description,
//           quantity: newQty,
//           notes: regularItem.notes
//         }
//       ]
//       return res(
//         ctx.status(200),
//         ctx.json(returnData)
//       )
//     })
  ]
}

export const NotEditable = () => (
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games }}>
      <ColorProvider colorScheme={PINK}>
        <ShoppingListsProvider overrideValue={{ shoppingLists }}>
          <ShoppingList
            title='All Items'
            listId={1}
            canEdit={false}
          />
        </ShoppingListsProvider>
      </ColorProvider>
    </GamesProvider>
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
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games }}>
      <ColorProvider colorScheme={PINK}>
        <ShoppingListsProvider overrideValue={{ shoppingLists: emptyShoppingLists }}>
          <ShoppingList
            title='Severin Manor'
            listId={2}
            canEdit={true}
          />
        </ShoppingListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)

export const EmptyAggregateList = () => (
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games }}>
      <ColorProvider colorScheme={PINK}>
        <ShoppingListsProvider overrideValue={{ shoppingLists: emptyShoppingLists }}>
          <ShoppingList
            title='All Items'
            listId={1}
            canEdit={false}
          />
        </ShoppingListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)
