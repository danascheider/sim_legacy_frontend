import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import { token, games } from '../../sharedTestData'
import InventoryListCreateForm from './inventoryListCreateForm'

const performInventoryListCreate = e => e.preventDefault()

const listItems = [
  {
    id: 1,
    list_id: 1,
    description: 'Ebony sword',
    quantity: 3,
    notes: 'Love those ebony swords'
  },
  {
    id: 2,
    list_id: 1,
    description: 'Necklace',
    quantity: 4,
    notes: 'Any unenchanted necklaces for enchanting'
  },
  {
    id: 3,
    list_id: 1,
    description: 'Iron ingot',
    quantity: 400,
    notes: 'Building Lakeview Manor takes some iron'
  }
]

const inventoryLists = [
  {
    id: 1,
    title: 'All Items',
    aggregate: true,
    list_items: listItems
  },
  {
    id: 1,
    title: 'My List 2',
    aggregate: false,
    list_items: listItems
  }
]

export default { title: 'InventoryListCreateForm' }

export const Enabled = () => (
  <AppProvider overrideValue={{ token }}>
    <GamesProvider overrideValue={{ games }}>
      <InventoryListsProvider overrideValue={{ performInventoryListCreate, inventoryLists }}>
        <InventoryListCreateForm disabled={false} />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

export const Disabled = () => (
  <AppProvider overrideValue={{ token }}>
    <GamesProvider overrideValue={{ games }}>
      <InventoryListsProvider overrideValue={{ performInventoryListCreate, inventoryLists }}>
        <InventoryListCreateForm disabled />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)
