import React from 'react'
import { PINK } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListForm from './shoppingListForm'

export default { title: 'ShoppingListForm' }

export const Default = () => (
  <ColorProvider colorScheme={PINK}>
    <ShoppingListForm
      className='foo'
      title='Severin Manor'
      onSubmit={e => e.preventDefault()}
    />
  </ColorProvider>
)
