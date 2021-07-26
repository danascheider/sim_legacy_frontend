import React from 'react'
import { rest } from 'msw'
import { PINK } from '../../utils/colorSchemes'
import { backendBaseUri } from '../../utils/config'
import { ColorProvider } from '../../contexts/colorContext'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import { token, games, allShoppingLists } from '../../sharedTestData'
import {
  adjustListItem,
  combineListItems,
  findAggregateList,
  findListByListItem
} from '../../sharedTestUtilities'
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
    // This enables you to edit the title of the editable list in Storybook.
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
    // This allows the user to test creation of a shopping list item on the list
    // in Storybook.
    rest.post(`${backendBaseUri}/shopping_lists/:listId/shopping_list_items`, (req, res, ctx) => {
      const description = req.body.shopping_list_item.description
      const quantity = parseInt(req.body.shopping_list_item.quantity)
      const notes = req.body.shopping_list_item.notes

      const attributes = { description, quantity, notes }

      const item = combineListItems(regularListItems.find(i => i.description.toLowerCase() === description.toLowerCase()), attributes)
      const aggListItem = combineListItems(aggregateListItems.find(i => i.description.toLowerCase() === description.toLowerCase()), attributes)

      if (item) {        
        return res(
          ctx.status(200),
          ctx.json([aggListItem, item])
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
    }),
    // This request updates a shopping list item by ID, assuming the shopping list
    // item exists and belongs to the authenticated user. For the purposes of
    // Storybook, we assume the user is authenticated and the `allShoppingLists`
    // array represents all their lists for all their games.
    rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      // Find the list the item is on
      const itemId = parseInt(req.params.id)
      const regList = findListByListItem(shoppingLists, itemId)

      if (regList) {
        // If the regular list exists, find the item and the aggregate list the item
        // is on. The corresponding item on that list will need to be updated as well.
        // Note that, for this story, incrementing and decrementing are the only way
        // to update an item - because there is no modal rendered in the story, the
        // edit form will not appear if you click the update link.
        const existingItem = regList.list_items.find(item => item.id === itemId)
        const aggregateList = findAggregateList(shoppingLists, regList.game_id)
        const newItem = { ...existingItem, ...req.body.shopping_list_item }
        const quantity = parseInt(newItem.quantity)
        newItem.quantity = quantity

        if (quantity > 0) {
          const deltaQuantity = quantity - existingItem.quantity
          const aggregateListItem = aggregateList.list_items.find(item => (
            item.description.toLowerCase() === existingItem.description.toLowerCase()
          ))

          adjustListItem(aggregateListItem, deltaQuantity, existingItem.notes, newItem.notes)

          return res(
            ctx.status(200),
            ctx.json([aggregateListItem, newItem])
          )
        } else {
          // If the quantity is less than 0, return a 422 error
          return res(
            ctx.status(422),
            ctx.json({ errors: ['Quantity must be greater than zero'] })
          )
        }
      } else {
        // Return a 404 error if the shopping list the item is on doesn't exist -
        // that means the item wasn't found in any list's array of list items
        return res(
          ctx.status(404)
        )
      }
    }),
    // This request deletes the requested shopping list item, if it exists and
    // belongs to the authenticated user. For the purposes of Storybook, we're
    // going to make this just work each time without doing the aggregate list
    // calculations, given that there is no aggregate list in this story.
    rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
      return res(
        ctx.status(204)
      )
    })
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

EmptyList.parameters = {
  msw: [
    // For this list we're going to enable adding list items but not editing
    // them. Any items you create will not be able to be incremented, decremented,
    // or updated in any way.
    rest.post(`${backendBaseUri}/shopping_lists/:listId/shopping_list_items`, (req, res, ctx) => {
      const listId = parseInt(req.params.listId)
      const description = req.body.shopping_list_item.description
      const quantity = parseInt(req.body.shopping_list_item.quantity)

      if (quantity > 0) {
        const returnData = [
          {
            id: Math.floor(Math.random() * 10000),
            list_id: 5388,
            description,
            quantity
          },
          {
            id: Math.floor(Math.random() * 10000),
            list_id: listId,
            description,
            quantity
          }
        ]

        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      } else {
        return res(
          ctx.status(422),
          ctx.json({
            errors: ['Quantity must be greater than zero']
          })
        )
      }
    })
  ]
}

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
