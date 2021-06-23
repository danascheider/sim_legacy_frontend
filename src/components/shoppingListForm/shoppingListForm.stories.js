import React from 'react'
import { PINK } from '../../utils/colorSchemes'
import ShoppingListForm from './shoppingListForm'

export default { title: 'ShoppingListForm' }

export const Default = () => (
  <ShoppingListForm
    className='foo'
    colorScheme={PINK}
    title='Severin Manor'
    onSubmit={e => e.preventDefault()}
  />
)
