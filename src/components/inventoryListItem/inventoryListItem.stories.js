import React from 'react'
import { BLUE } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import { ColorProvider } from '../../contexts/colorContext'
import { token, profileData, games, allInventoryLists as inventoryLists } from '../../sharedTestData'
import InventoryListItem from './inventoryListItem'

export default { title: 'InventoryListItem' }

export const Default = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <InventoryListsProvider overrideValue={{ inventoryLists }}>
        <ColorProvider colorScheme={BLUE}>
          <InventoryListItem
            itemId={1}
            description='Ebony sword'
            listTitle='Lakeview Manor'
            quantity={1}
            unitWeight={14.0}
            notes='Enchanted with Soul Trap'
          />
        </ColorProvider>
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)
