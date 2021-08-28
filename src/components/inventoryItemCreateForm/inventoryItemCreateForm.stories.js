import React from 'react'
import { YELLOW } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import {
  token,
  games,
  profileData,
  emptyInventoryLists as inventoryLists
} from '../../sharedTestData'
import InventoryItemCreateForm from './inventoryItemCreateForm'

export default { title: 'InventoryListItemCreateForm' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <InventoryListsProvider overrideValue={{ inventoryLists }}>
        <ColorProvider colorScheme={YELLOW}>
          <InventoryItemCreateForm listId={3} />
        </ColorProvider>
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)
