import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { ColorProvider } from '../../contexts/colorContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import { shoppingLists } from './storyData'
import ShoppingListItem from './shoppingListItem'

const token = 'xxxxxxxxx'

export default { title: 'ShoppingListItem' }

export const Editable = () => (
  <AppProvider overrideValue={{ token }}>
    <ShoppingListProvider overrideValue={{ shoppingLists: shoppingLists }}>
      <ColorProvider colorScheme={GREEN}>
        <ShoppingListItem
          itemId={42}
          canEdit={true}
          description='Ebony sword'
          quantity={4}
          notes='Need some swords'
        />
      </ColorProvider>
    </ShoppingListProvider>
  </AppProvider>
)

Editable.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri}/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(shoppingLists)
        )
      }),
      rest.patch(`${backendBaseUri}/shopping_list_items/42`, (req, res, ctx) => {
        const newQty = req.body.shopping_list_item.quantity

        const returnData = [
          {
            id: 2,
            list_id: 1,
            description: 'Ebony sword',
            quantity: newQty,
            notes: 'Need some swords'
          },
          {
            id: 42,
            list_id: 2,
            description: 'Ebony sword',
            quantity: newQty,
            notes: 'Need some swords'
          }
        ]
        return res(
          ctx.status(200),
          ctx.json(returnData)
        )
      })
    ]
  }
}

export const NotEditable = () => (
  <AppProvider overrideValue={{ token }}>
    <ShoppingListProvider overrideValue={{ shoppingLists }}>
      <ColorProvider colorScheme={GREEN}>
        <ShoppingListItem
          itemId={42}
          canEdit={false}
          description='Ebony sword'
          quantity={4}
          notes='Need some swords'
        />
      </ColorProvider>
    </ShoppingListProvider>
  </AppProvider>
)
