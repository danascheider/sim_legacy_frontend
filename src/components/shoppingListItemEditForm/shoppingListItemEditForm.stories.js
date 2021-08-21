import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import Modal from '../../components/modal/modal'
import { token, profileData, games, allShoppingLists as shoppingLists } from '../../sharedTestData'
import ShoppingListItemEditForm from './shoppingListItemEditForm'

export default { title: 'ShoppingListItemEditForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingLists, performShoppingListItemUpdate: () => {} }}>
        <Modal
          title={shoppingLists[1].list_items[0].description}
          subtitle={`On list "${shoppingLists[1].title}"`}
          setVisible={() => {}}
        >
          <ShoppingListItemEditForm buttonColor={GREEN} currentAttributes={shoppingLists[1].list_items[0]} />
        </Modal>
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)
