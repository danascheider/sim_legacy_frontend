import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItem from './shoppingListItem'

export default { title: 'ShoppingListItem' }

export const Default = () => (
  <ColorProvider colorScheme={GREEN}>
    <ShoppingListItem
      description='Ebony sword'
      quantity={2}
      notes='One to enchant with Soul Trap, one to enchant with Absorb Health'
    />
  </ColorProvider>
)
