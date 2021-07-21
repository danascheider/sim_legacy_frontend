import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import { token, games, allShoppingLists as shoppingLists } from '../../sharedTestData'
import ShoppingListItem from './shoppingListItem'

export default { title: 'ShoppingListItem' }

export const Editable = () => (
  <AppProvider overrideValue={{ token }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingLists }}>
        <ColorProvider colorScheme={GREEN}>
          <ShoppingListItem
            itemId={42}
            canEdit={true}
            description='Ebony sword'
            quantity={4}
            notes='Need some swords'
          />
        </ColorProvider>
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)

// Editable.parameters = {
//   msw: [
//     rest.patch(`${backendBaseUri}/shopping_list_items/42`, (req, res, ctx) => {
//       const newQty = req.body.shopping_list_item.quantity

//       const returnData = [
//         {
//           id: 2,
//           list_id: 1,
//           description: 'Ebony sword',
//           quantity: newQty,
//           notes: 'Need some swords'
//         },
//         {
//           id: 42,
//           list_id: 2,
//           description: 'Ebony sword',
//           quantity: newQty,
//           notes: 'Need some swords'
//         }
//       ]
//       return res(
//         ctx.status(200),
//         ctx.json(returnData)
//       )
//     })
//   ]
// }

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
