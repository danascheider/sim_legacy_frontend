import React from 'react'
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

const colorScheme = {
  outerColor: '#E83F6F',
  hoverColor: '#D03863',
  borderColor: '#B93258',
  textColor: '#FFFFFF',
  listItemHeaderColor: '#EC658B',
  listItemHoverColor: '#EA527D',
  listItemTitleTextColor: '#FFFFFF',
  listItemBodyTextColor: '#000000',
  listItemBodyBackgroundColor: '#FAD8E2'
}

export default { title: 'ShoppingList' }

export const Default = () => (
  <ShoppingList
    title='My List 1'
    colorScheme={colorScheme}
    listItems={listItems}
  />
)
