import React from 'react'
import { rest } from 'msw'
import { AQUA } from '../../utils/colorSchemes'
import { backendBaseUri } from '../../utils/config'
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

/*
 *
 * When there are list items and `canEdit` is set to `true` (this is
 * the default)
 *
 */

export const Editable = () => (
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <ColorProvider colorScheme={AQUA}>
        <InventoryListsProvider
          overrideValue={{ inventoryLists, performInventoryListDestroy: () => {}, performInventoryItemCreate: () => {} }}
        >
          <InventoryList
            listId={2}
            title='My List 1'
          />
        </InventoryListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)

Editable.parameters = {
  msw: [
    // This enables you to edit the title of the editable list in Storybook.
    rest.patch(`${backendBaseUri}/inventory_lists/2`, (req, res, ctx) => {
      const title = req.body.inventory_list.Title

      return res(
        ctx.status(200),
        ctx.json({
          ...inventoryLists[1],
          title
        })
      )
    })
  ]
}

/*
 *
 * When there are list items and `canEdit` is set to `false`
 *
 */

export const NotEditable = () => (
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <ColorProvider colorScheme={AQUA}>
        <InventoryListsProvider overrideValue={{ inventoryLists }}>
          <InventoryList
            listId={1}
            title='All Items'
            canEdit={false}
          />
        </InventoryListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)

const emptyInventoryLists = [
  {
    id: 1,
    title: 'All Items',
    user_id: 24,
    list_items: [],
    aggregate: true
  },
  {
    id: 2,
    title: 'Carried Items',
    user_id: 24,
    list_items: [],
    aggregate: false
  }
]

/*
 *
 * When there are no list items and `canEdit` is set to `true`
 *
 */

export const EmptyList = () => (
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <ColorProvider colorScheme={AQUA}>
        <InventoryListsProvider
          overrideValue={{ inventoryLists: emptyInventoryLists, performInventoryListDestroy: () => {}, performInventoryItemCreate: () => {} }}
        >
          <InventoryList
            listId={2}
            title='My List 2'
          />
        </InventoryListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)

EmptyList.parameters = {
  msw: [
    // This enables you to edit the title of the editable list in Storybook.
    rest.patch(`${backendBaseUri}/inventory_lists/2`, (req, res, ctx) => {
      const title = req.body.inventory_list.Title

      return res(
        ctx.status(200),
        ctx.json({
          ...inventoryLists[1],
          title
        })
      )
    })
  ]
}

/*
 *
 * When the list is empty and `canEdit` is set to `false`
 *
 */

export const EmptyAggregateList = () => (
  <AppProvider overrideValue={{ token, setShouldRedirectTo: () => null }}>
    <GamesProvider overrideValue={{ games }}>
      <ColorProvider colorScheme={AQUA}>
        <InventoryListsProvider overrideValue={{ inventoryLists: emptyInventoryLists }}>
          <InventoryList
            title='All Items'
            listId={1}
            canEdit={false}
          />
        </InventoryListsProvider>
      </ColorProvider>
    </GamesProvider>
  </AppProvider>
)
