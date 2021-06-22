import React from 'react'
import ShoppingListItem from './shoppingListItem'

export default { title: 'ShoppingListItem' }

export const Default = () => (
  <ShoppingListItem
    description='Ebony sword'
    quantity={2}
    notes='One to enchant with Soul Trap, one to enchant with Absorb Health'
  />
)
