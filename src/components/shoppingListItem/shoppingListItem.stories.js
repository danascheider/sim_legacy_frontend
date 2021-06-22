import React from 'react'
import ShoppingListItem from './shoppingListItem'

const colorScheme = {
  schemeColor: '#E83F6F',
  titleTextColor: '#FFFFFF',
  bodyTextColor: '#000000',
  borderColor: '#B93258',
  bodyBackgroundColor: '#FAD8E2',
  hoverColor: '#D03863'
}

export default { title: 'ShoppingListItem' }

export const Default = () => (
  <ShoppingListItem
    description='Ebony sword'
    quantity={2}
    notes='One to enchant with Soul Trap, one to enchant with Absorb Health'
    colorScheme={colorScheme}
  />
)
