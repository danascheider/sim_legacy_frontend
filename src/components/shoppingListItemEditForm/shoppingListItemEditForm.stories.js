import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import { listItemData, shoppingLists } from './storyData'
import { token, profileData, games } from '../../sharedTestData'
import ShoppingListItemEditForm from './shoppingListItemEditForm'

const containerStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)'
}

export default { title: 'ShoppingListItemEditForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingLists }}>
        <div style={containerStyle}>
          <ShoppingListItemEditForm listTitle={shoppingLists[1].title} buttonColor={GREEN} currentAttributes={listItemData} />
        </div>
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)
