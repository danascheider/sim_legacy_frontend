import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import Modal from '../../components/modal/modal'
import { token, profileData, games } from '../../sharedTestData'
import { listItemData, inventoryLists } from './storyData'
import InventoryListItemEditForm from './inventoryListItemEditForm'

export default { title: 'InventoryListItemEditForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider overrideValue={{ inventoryLists, inventoryListLoadingState: 'done', performInventoryListItemUpdate: e => e.preventDefault() }}>
        <Modal
          title={listItemData.description}
          subtitle={`On list "${inventoryLists[1].title}"`}
          setVisible={() => {}}
        >
          <InventoryListItemEditForm buttonColor={GREEN} currentAttributes={listItemData} />
        </Modal>
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)
