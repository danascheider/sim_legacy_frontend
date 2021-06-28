import React from 'react'
import { PINK } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListEditForm from './shoppingListEditForm'

export default { title: 'ShoppingListEditForm' }

export const Default = () => (
  <ColorProvider colorScheme={PINK}>
    <ShoppingListEditForm
      className='foo'
      title='Severin Manor'
      onSubmit={e => e.preventDefault()}
    />
  </ColorProvider>
)
