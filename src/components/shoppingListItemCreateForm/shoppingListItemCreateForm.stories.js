import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { ColorProvider } from '../../contexts/colorContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import ShoppingListItemCreateForm from './shoppingListItemCreateForm'

const token = 'xxxxxxxxxx'

export default { title: 'ShoppingListItemCreateForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token }}>
    <ShoppingListsProvider overrideValue={{ shoppingLists: [] }}>
      <ColorProvider colorScheme={GREEN}>
        <ShoppingListItemCreateForm listId={3} />
      </ColorProvider>
    </ShoppingListsProvider>
  </AppProvider>
)
