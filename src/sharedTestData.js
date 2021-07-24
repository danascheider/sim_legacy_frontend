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
 * Storybook, you should create a /src/sharedTestUtilities.js
 * file in the same directory as this file.
 *
 */

export const emptyGames = []

export const emptyShoppingLists = []

export const emptyShoppingListItems = []

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
// In the future, we'll do a similar thing with shopping lists and
// list items - two of the first game's regular lists will have list
// items and one won't. In Storybook, we'll be able to see how a
// list looks with no items, as well as having a realistic example of
// items combining themselves on the aggregate ('All Items') list.
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
