import React from 'react'
import { PINK } from '../../utils/colorSchemes'
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
  <ShoppingList
    title='My List 1'
    colorScheme={PINK}
    listItems={listItems}
  />
)
