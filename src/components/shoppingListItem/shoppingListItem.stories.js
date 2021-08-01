import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import { token, games, allShoppingLists as shoppingLists } from '../../sharedTestData'
import {
  adjustListItem,
  findAggregateList,
  findListByListItem
} from '../../sharedTestUtilities'
import ShoppingListItem from './shoppingListItem'

export default { title: 'ShoppingListItem' }

export const Editable = () => (
  <AppProvider overrideValue={{ token }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingLists }}>
        <ColorProvider colorScheme={GREEN}>
          <ShoppingListItem
            itemId={1}
            canEdit={true}
            description='Ebony sword'
            listTitle='Lakeview Manor'
            quantity={4}
            notes='Need some swords'
          />
        </ColorProvider>
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)

Editable.parameters = {
  msw: [
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
    })
  ]
}

export const NotEditable = () => (
  <AppProvider overrideValue={{ token }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingLists }}>
        <ColorProvider colorScheme={GREEN}>
          <ShoppingListItem
            itemId={42}
            canEdit={false}
            description='Ebony sword'
            quantity={4}
            notes='Need some swords'
          />
        </ColorProvider>
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)
