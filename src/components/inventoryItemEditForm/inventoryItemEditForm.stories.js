import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import Modal from '../../components/modal/modal'
import { token, profileData, games, allInventoryLists as inventoryLists } from '../../sharedTestData'
import InventoryItemEditForm from './inventoryItemEditForm'

export default { title: 'InventoryItemEditForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider overrideValue={{ inventoryLists, inventoryListLoadingState: 'done', performInventoryItemUpdate: () => {} }}>
        <Modal
          title={inventoryLists[1].list_items[0].description}
          subtitle={`On list "${inventoryLists[1].title}"`}
          setVisible={() => {}}
        >
          <InventoryItemEditForm buttonColor={GREEN} currentAttributes={inventoryLists[1].list_items[0]} />
        </Modal>
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)
