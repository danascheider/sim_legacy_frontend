import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import { token, games, emptyShoppingLists as shoppingLists } from '../../sharedTestData'
import ShoppingListItemCreateForm from './shoppingListItemCreateForm'

export default { title: 'ShoppingListItemCreateForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingLists }}>
        <ColorProvider colorScheme={GREEN}>
          <ShoppingListItemCreateForm listId={3} />
        </ColorProvider>
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)
