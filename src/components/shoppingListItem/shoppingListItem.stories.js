import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { ColorProvider } from '../../contexts/colorContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import ShoppingListItem from './shoppingListItem'

const token = 'xxxxxxxxx'

export default { title: 'ShoppingListItem' }

export const Default = () => (
  <AppProvider overrideValue={{ token }}>
    <ShoppingListProvider overrideValue={{ shoppingListItems: [] }}>
      <ColorProvider colorScheme={GREEN}>
        <ShoppingListItem
          id={42}
          description='Ebony sword'
          quantity={2}
          notes='One to enchant with Soul Trap, one to enchant with Absorb Health'
        />
      </ColorProvider>
    </ShoppingListProvider>
  </AppProvider>
)
