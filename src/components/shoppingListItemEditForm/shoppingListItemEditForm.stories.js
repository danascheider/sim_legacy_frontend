import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import Modal from '../../components/modal/modal'
import { token, profileData, games } from '../../sharedTestData'
import { listItemData, shoppingLists } from './storyData'
import ShoppingListItemEditForm from './shoppingListItemEditForm'

export default { title: 'ShoppingListItemEditForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <ShoppingListsProvider overrideValue={{ shoppingLists }}>
        <Modal
          title={listItemData.description}
          subtitle={`On list "${shoppingLists[1].title}"`}
          setVisible={() => {}}
        >
          <ShoppingListItemEditForm buttonColor={GREEN} currentAttributes={listItemData} />
        </Modal>
      </ShoppingListsProvider>
    </GamesProvider>
  </AppProvider>
)
