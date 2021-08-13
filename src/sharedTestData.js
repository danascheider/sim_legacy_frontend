/*
 *
 * This file contains data that can be used for multiple tests
 * and/or Storybook stories. Data that will be used in only a
 * single test or only a single component's story should be added
 * to a testData.js file within that component's subdirectory.
 * Think of this file like database seeds.
 *
 * This file should only export test data. If you would like to
 * export functions or other values, please put them in the
 * /src/setupTests.js file for Jest tests, or for Storybook,
 * in a testUtilities.js within the component's subdirectory.
 * If functions or other values are needed for both Jest and
 * Storybook, you should put it in /src/sharedTestUtilities.js.
 *
 */

export const emptyGames = []

export const emptyShoppingLists = []

export const emptyShoppingListItems = []

export const emptyInventoryLists = []

export const emptyInventoryListItems = []

export const token = 'xxxxxxx'

export const profileData = {
  id: 24,
  name: 'Jane Doe',
  email: 'jane.doe@gmail.com',
  uid: 'jane.doe@gmail.com',
  image_url: null
}

export const games = [
  {
    id: 345,
    user_id: 24,
    name: 'My Game 1',
    description: 'This is the first game'
  },
  {
    id: 572,
    user_id: 24,
    name: 'Neque porro quisquam est quis dolorem ipsum quia dolor sit amet',
    description: 'This is the second game'
  },
  {
    id: 231,
    user_id: 24,
    name: 'My Game 2',
    description: null
  }
]

// These are shopping lists for the first two games. The first game
// has 4 lists, the second has 2, and the third has none, so we can
// illustrate the cases where a game has lists as well as the case
// where it doesn't.
//
// To use these lists in tests, this array can be filtered to select
// just shopping lists for a particular game:
//
//     const shoppingLists = allShoppingLists.filter(
//       list => list.game_id === games[0].id
//     )
//     return(
//       <ShoppingListsProvider overrideValue={{ shoppingLists }}>
//         {/* children go here */}
//       </ShoppingListsProvider>)/>
//     )
//
export const allShoppingLists = [
  // Game 1 shopping lists
  {
    id: 823,
    game_id: games[0].id,
    title: 'All Items',
    aggregate: true,
    list_items: [
      {
        id: 2,
        list_id: 823,
        description: 'Ebony sword',
        quantity: 2,
        notes: 'notes 1 -- notes 2'
      },
      {
        id: 4,
        list_id: 823,
        description: 'Ingredients with "Frenzy" property',
        quantity: 4,
        notes: null
      }
    ]
  },
  {
    id: 837,
    game_id: games[0].id,
    title: 'Lakeview Manor',
    aggregate: false,
    list_items: [
      {
        id: 1,
        list_id: 837,
        description: 'Ebony sword',
        quantity: 1,
        notes: 'notes 1'
      },
      {
        id: 3,
        list_id: 837,
        description: 'Ingredients with "Frenzy" property',
        quantity: 4,
        notes: null
      }
    ]
  },
  {
    id: 721,
    game_id: games[0].id,
    title: 'Heljarchen Hall',
    aggregate: false,
    list_items: [
      {
        id: 5,
        list_id: 721,
        description: 'Ebony sword',
        quantity: 1,
        notes: 'notes 2'
      }
    ]
  },
  {
    id: 963,
    game_id: games[0].id,
    title: 'Breezehome',
    aggregate: false,
    list_items: emptyShoppingListItems
  },

  // Game 2 shopping lists
  {
    id: 3451,
    game_id: games[1].id,
    title: 'All Items',
    aggregate: true,
    list_items: emptyShoppingListItems
  },
  {
    id: 4352,
    game_id: games[1].id,
    title: 'Windstad Manor',
    aggregate: false,
    list_items: emptyShoppingListItems
  },
  {
    id: 6818,
    game_id: games[1].id,
    title: 'Hjerim',
    aggregate: false,
    list_items: emptyShoppingListItems
  }
]

// These are inventory lists for the first two games. The first game
// has 4 lists, the second has 2, and the third has none, so we can
// illustrate the cases where a game has lists as well as the case
// where it doesn't.
//
// To use these lists in tests, this array can be filtered to select
// just inventory lists for a particular game:
//
//     const inventoryLists = allInventoryLists.filter(
//       list => list.game_id === games[0].id
//     )
//     return(
//       <InventoryListsProvider overrideValue={{ shoppingLists }}>
//         {/* children go here */}
//       </InventoryListsProvider>)/>
//     )
//
export const allInventoryLists = [
  // Game 1 inventory lists
  {
    id: 823,
    game_id: games[0].id,
    title: 'All Items',
    aggregate: true,
    list_items: [
      {
        id: 2,
        list_id: 823,
        description: 'Ebony sword',
        quantity: 2,
        notes: 'notes 1 -- notes 2',
        unit_weight: 14.0
      },
      {
        id: 4,
        list_id: 823,
        description: 'Nirnroot',
        quantity: 4,
        notes: null,
        unit_weight: 0.3
      }
    ]
  },
  {
    id: 837,
    game_id: games[0].id,
    title: 'Lakeview Manor',
    aggregate: false,
    list_items: [
      {
        id: 1,
        list_id: 837,
        description: 'Ebony sword',
        quantity: 1,
        notes: 'notes 1',
        unit_weight: 14.0
      },
      {
        id: 3,
        list_id: 837,
        description: 'Nirnroot',
        quantity: 4,
        notes: null,
        unit_weight: 0.3
      }
    ]
  },
  {
    id: 721,
    game_id: games[0].id,
    title: 'Heljarchen Hall',
    aggregate: false,
    list_items: [
      {
        id: 5,
        list_id: 721,
        description: 'Ebony sword',
        quantity: 1,
        notes: 'notes 2',
        unit_weight: 14.0
      }
    ]
  },
  {
    id: 963,
    game_id: games[0].id,
    title: 'Breezehome',
    aggregate: false,
    list_items: emptyInventoryListItems
  },

  // Game 2 inventory lists
  {
    id: 3451,
    game_id: games[1].id,
    title: 'All Items',
    aggregate: true,
    list_items: emptyShoppingListItems
  },
  {
    id: 4352,
    game_id: games[1].id,
    title: 'Windstad Manor',
    aggregate: false,
    list_items: emptyInventoryListItems
  },
  {
    id: 6818,
    game_id: games[1].id,
    title: 'Hjerim',
    aggregate: false,
    list_items: emptyInventoryListItems
  }
]
