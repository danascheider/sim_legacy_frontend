import React from 'react'
import { AQUA } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import { token, games } from '../../sharedTestData'
import InventoryList from './inventoryList'

const regularListItems = [
  {
    id: 1,
    list_id: 2,
    description: 'Ebony sword',
    quantity: 3,
    notes: 'Love those ebony swords',
    unit_weight: 14.0
  },
  {
    id: 2,
    list_id: 2,
    description: 'Gold jewelled necklace',
    quantity: 4,
    notes: 'Enchanted with alchemy enchantment',
    unit_weight: 0.5
  }
]

const aggregateListItems = [
  {
    id: 3,
    list_id: 1,
    description: 'Ebony sword',
    quantity: 3,
    notes: 'Love those ebony swords',
    unit_weight: 14.0
  },
  {
    id: 4,
    list_id: 1,
    description: 'Gold jewelled necklace',
    quantity: 4,
    notes: 'Enchanted with alchemy enchantment',
    unit_weight: 0.5
  }
]

const inventoryLists = [
  {
    id: 1,
    user_id: 24,
    title: 'All Items',
    aggregate: true,
    list_items: aggregateListItems
  },
  {
    id: 2,
    user_id: 24,
    title: 'My List 1',
    aggregate: false,
    list_items: regularListItems
  },
  {
    id: 3,
    user_id: 24,
    title: 'My List 2',
    aggregate: false,
    list_items: []
  }
]

export default { title: 'InventoryList' }

export const Default = () => (
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games }}>
      <ColorProvider colorScheme={AQUA}>
        <InventoryListsProvider overrideValue={{ inventoryLists }}>
          <InventoryList
            listId={2}
            title='My List 1'
          />
        </InventoryListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)

export const EmptyList = () => (
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games }}>
      <ColorProvider colorScheme={AQUA}>
        <InventoryListsProvider overrideValue={{ inventoryLists }}>
          <InventoryList
            listId={3}
            title='My List 2'
          />
        </InventoryListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)
