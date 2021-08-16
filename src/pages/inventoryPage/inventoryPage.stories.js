
import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { InventoryListsProvider } from '../../contexts/inventoryListsContext'
import {
  token,
  profileData,
  emptyGames,
  games,
  emptyInventoryLists,
  allInventoryLists
} from '../../sharedTestData'
import {
  findAggregateList,
  findListByListItem,
  adjustListItem,
  removeOrAdjustItemsOnListDestroy,
  removeOrAdjustItemOnItemDestroy
} from '../../sharedTestUtilities'
import InventoryPage from './inventoryPage'

export default { title: 'InventoryPage' }

/* 
 * 
 * When the user is logged in, has inventory lists, and the inventory
 * lists are able to be created or updated without incident. Also tests that,
 * when a user assigns a blank title and the API response returns a default
 * one, the title first stays blank then updates to the default one when the
 * response comes back.
 * 
 */

export const HappyPath = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

// Although POST requests to /games can originate from this page (from the games
// dropdown), no handlers for that request are defined in these stories. This is
// because creating a new game that way will trigger a GET request for that game's
// inventory lists, which will trigger a 404 response since the game isn't in the
// `games` array. We could hack this but it's not really worth it for Storybook.
// Better to rely on manual testing and Jest for this.
HappyPath.parameters = {
  msw: [
    // This request retrieves a list of inventory lists for a given game, (if the game
    // exists and belongs to the authenticated user). For the purpose of Storybook, we
    // assume the user is authenticated and these are all their games.
    rest.get(`${backendBaseUri}/games/:game_id/inventory_lists`, (req, res, ctx) => {
      // Find the game whose inventory lists have been requested in the `games` array,
      // which represents all the games belonging to the logged-in user.
      const gameId = parseInt(req.params.game_id)
      const game = games.find(g => g.id === gameId)

      if (game) {
        // If the game is found, get its inventory lists out of the allInventoryLists array.
        // This will return an array (which could be empty or not). The new array will then
        // be returned from the API with a 200 response.
        const lists = allInventoryLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      } else {
        // If the game whose lists were requested doesn't exist, the API will return a 404
        // error. This will happen if the user manually changes the query string `game_id`
        // param to an ID that doesn't exist, or if the user attempts to retrieve inventory
        // lists for a game that has been destroyed on another device/browser without
        // refreshing the page first.
        return res(
          ctx.status(404)
        )
      }
    }),
    // This request creates a new inventory list for the given game (if it exists and belongs
    // to the authenticated user). For the purposes of Storybook, we'll assume the user is
    // authenticated and the `games` array represents all their games.
    rest.post(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const game = games.find(g => g.id === gameId)
      const lists = allInventoryLists.filter(list => list.game_id === gameId)

      if (game) {
        // If the game exists, the API will create a new inventory list for that game and
        // return a 201 Created status with the inventory list in the response body.
        const title = req.body.inventory_list.title || 'My List 3'
        const existingList = lists.find(list => list.title === title)

        if (existingList) {
          return res(
            ctx.status(422),
            ctx.json({
              errors: ['Title must be unique per game']
            })
          )
        } else {
          const returnData = { id: Math.floor(Math.random() * 10000), game_id: gameId, title, aggregate: false, list_items: [] }

          return res(
            ctx.status(201),
            ctx.json(returnData)
          )
        }
      } else {
        // If the game doesn't exist (or doesn't belong to the authenticated user), the API
        // will return a 404 Not Found status.
        return res(
          ctx.status(404)
        )
      }
    }),
    // This request updates a given inventory list, if the list exists and belongs to the
    // authenticated user, and if the request body is properly formed with valid attributes.
    // For the purposes of Storybook, we'll assume the user is authenticated and the
    // `allInventoryLists` array represents all of their inventory lists for all their games.
    rest.patch(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      // Find the list requested
      const listId = parseInt(req.params.id)
      const listToUpdate = allInventoryLists.find(list => list.id === listId)

      if (listToUpdate) {
        // If the list requested is valid and the title isn't a duplicate, update the
        // inventory list and return the updated list.
        const title = req.body.inventory_list.title || 'My List 1'
        const otherListsForSameGame = allInventoryLists.filter(list => list.game_id === listToUpdate.game_id)
        const existingListWithSameTitle = otherListsForSameGame.find(list => list.title.toLowerCase() === title.toLowerCase())

        if (existingListWithSameTitle) {
          // If it is a duplicate title, return 422
          return res(
            ctx.status(422),
            ctx.json({
              errors: ['Title must be unique per game']
            })
          )
        } else {
          // If it isn't a duplicate title, return a success response with the updated list.
          const returnData = { ...listToUpdate, title }

          return res(
            ctx.status(200),
            ctx.json(returnData)
          )
        }
      } else {
        // In the case where the list is not found, return a 404.
        return res(
          ctx.status(404)
        )
      }
    }),
    // This request deletes the given inventory list if it exists and belongs to the
    // authenticated user. For the purposes of Storybook, we assume the user is logged
    // in and the `allInventoryLists` array represents all of their inventory lists for
    // all of their games.
    rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      // Find the requested list
      const listId = parseInt(req.params.id)
      const regularList = allInventoryLists.find(list => list.id === listId)

      if (regularList) {
        // If the regular list matches an ID in the allInventoryLists array, check if
        // the aggregate list has any items on it once the list is destroyed.
        const items = regularList.list_items
        const aggregateList = findAggregateList(allInventoryLists, regularList.game_id)

        const newAggregateList = removeOrAdjustItemsOnListDestroy(aggregateList, items)

        if (newAggregateList === null) {
          // If the updated aggregate list has no items on it, that means the list being
          // deleted is the game's last regular list and the aggregate list will be
          // destroyed as well on the back end. In this scenario, the API will return a
          // 204 No Content response.
          return res(
            ctx.status(204)
          )
        } else {
          // If the updated aggregate list still has items on it, that means the list being
          // deleted is not the game's last regular list. In this scenario, the API will return
          // a 200 response with the updated aggregate list.
          return res(
            ctx.status(200),
            ctx.json(newAggregateList)
          )
        }
      } else {
        // If the list to be deleted is not found in the allInventoryLists array, that means
        // the list either doesn't exist or doesn't belong to the user. In this case, the API
        // will return status 404 Not Found.
        return res(
          ctx.status(404)
        )
      }
    }),
    // This request adds an inventory list item to the inventory list requested, if that inventory
    // list exists and belongs to the authenticated user. For the purposes of Storybook, we
    // assume the user is authenticated and the `allInventoryLists` array represents all their
    // inventory lists for all their games.
    rest.post(`${backendBaseUri}/inventory_lists/:listId/inventory_list_items`, (req, res, ctx) => {
      // Find the inventory list the user wants to add the item to
      const listId = parseInt(req.params.listId)
      const regList = allInventoryLists.find(list => list.id === listId)

      if (regList) {
        // If the inventory list exists and the request params are valid, the API will
        // do one of two things. If the params are valid and there is an existing item
        // on the same list with a matching description, it will update the existing item,
        // adding the quantity from the request params and concatenating notes values, if
        // any, so they are separated by `' -- '`. Then the API will find the matching
        // item on the aggregate list and update it as well.
        //
        // If the params are valid and there is no existing item with a matching
        // description on the same list, the API will create a new item on that list. Then,
        // it will check to see if there is already a matching item on the aggregate list.
        // If there is a matching item on the aggregate list, that item will be updated as
        // described above. If there is no matching item, a new one will be created with
        // the `notes` and `description` values from the request.
        const description = req.body.inventory_list_item.description
        const quantity = req.body.inventory_list_item.quantity || '1'
        const unit_weight = req.body.inventory_list_item.unit_weight

        // Description and quantity are both required and neither can be blank. The
        // quantity must be an integer as well. If the quantity is a decimal/float value
        // greater than 1, it will be truncated and treated as an integer. If the
        // quantity is non-numeric or less than 1, it is invalid.
        if (description && quantity && (typeof quantity === 'number' || quantity.match(/[1-9]+(\.\d+)?/))) {
          const regListItem = regList.list_items.find(item => item.description.toLowerCase() === description.toLowerCase())
          const notes = req.body.inventory_list_item.notes

          const aggregateList = findAggregateList(allInventoryLists, regList.game_id)
          const aggregateListItem = aggregateList.list_items.find(item => item.description.toLowerCase() === description.toLowerCase())

          if (regListItem) adjustListItem(regListItem, parseInt(quantity), regListItem.notes, notes)
          if (aggregateListItem) adjustListItem(aggregateListItem, parseInt(quantity), aggregateListItem.notes, notes)

          const defaultRegListItem = { id: Math.floor(Math.random() * 10000), list_id: regList.id, description, quantity }
          const defaultAggListItem = { id: Math.floor(Math.random() * 10000), list_id: aggregateList.id, description, quantity }

          // The API will return the updated aggregate list item along with the created or
          // updated list item from the regular list with a 200 status.
          const returnData = [aggregateListItem || defaultAggListItem, regListItem || defaultRegListItem]

          return res(
            ctx.status(200),
            ctx.json(returnData)
          )
        } else {
          const errors = []
          // Invalid values will result in a 422 error. This will approximate API
          // behaviour and error messages when a value is invalid.
          if (!quantity) errors.push('Quantity is required')
          if (quantity && !quantity.match(/[1-9]+(\.\d+)?/)) errors.push('Quantity must be a number')
          // There are no validations on description format, it's just required to be there.
          if (unit_weight && !unit_weight.match(/^[1-9]+(\.\d+)?$/)) errors.push('Unit weight must be a number')
          if (!description) errors.push('Description is required')

          return res(
            ctx.status(422),
            ctx.json({ errors })
          )
        }
      } else {
        // If the inventory list is not found, the API will return a 404.
        return res(
          ctx.status(404)
        )
      }
    })
  ]
}

/*
 *
 * When the user has no games
 *
 */

export const NoGames = () => {
  return(
    <AppProvider overrideValue={{ profileData, token }}>
      <GamesProvider overrideValue={{ games: emptyGames, gameLoadingState: 'done' }}>
        <InventoryListsProvider>
          <InventoryPage />
        </InventoryListsProvider>
      </GamesProvider>
    </AppProvider>
  )
}

// This is the only story where I'll define handlers for creating a game and
// fetching its (empty) inventory lists, since it's easy to just say all requests
// for inventory lists for this story will return an empty array.
NoGames.parameters = {
  msw: [
    rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
      const name = req.body.game.name

      return res(
        ctx.status(201),
        ctx.json({
          id: Math.floor(Math.random() * 10000),
          user_id: profileData.id,
          description: null,
          name
        })
      )
    }),
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(emptyInventoryLists)
      )
    })
  ]
}

/*
 *
 * When the requested game doesn't exist or doesn't belong to
 * the authenticated user
 *
 */

export const GameNotFoundOnLoad = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

GameNotFoundOnLoad.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    })
  ]
}

/*
 *
 * When the requested game has loaded and then been deleted on
 * another device or browser, attempting to create an inventory list
 * for that game will result in a 404. This is an edge case.
 *
 */

export const GameNotFoundOnCreate = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

GameNotFoundOnCreate.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const lists = allInventoryLists.filter(list => list.game_id === gameId)

      return res(
        ctx.status(200),
        ctx.json(lists)
      )
    }),
    rest.post(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    rest.patch(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    rest.post(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    })
  ]
}

/*
 *
 * When the user attempts to update or destroy a list/item that has already been
 * destroyed on another device or browser
 *
 */

export const ListOrItemNotFound = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

// Although POST requests to /games can originate from this page (from the games
// dropdown), no handlers for that request are defined in this story. This is
// because creating a new game that way will trigger a GET request for that game's
// inventory lists, which will trigger a 404 response since the game isn't in the
// `games` array. We could hack this but it's not really worth it for Storybook.
// Better to rely on manual testing and Jest for this.
ListOrItemNotFound.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const lists = allInventoryLists.filter(list => list.game_id === gameId)

      return res(
        ctx.status(200),
        ctx.json(lists)
      )
    }),
    // This request creates a new inventory list for the given game (if it exists and belongs
    // to the authenticated user). For the purposes of Storybook, we'll assume the user is
    // authenticated and the `games` array represents all their games.
    rest.post(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const game = games.find(g => g.id === gameId)
      const lists = allInventoryLists.filter(list => list.game_id === gameId)

      if (game) {
        // If the game exists, the API will create a new inventory list for that game and
        // return a 201 Created status with the inventory list in the response body.
        const title = req.body.inventory_list.title || 'My List 3'
        const existingList = lists.find(list => list.title === title)

        if (existingList) {
          return res(
            ctx.status(422),
            ctx.json({
              errors: ['Title must be unique per game']
            })
          )
        } else {
          const returnData = { id: Math.floor(Math.random() * 10000), game_id: gameId, title, aggregate: false, list_items: [] }

          return res(
            ctx.status(201),
            ctx.json(returnData)
          )
        }
      } else {
        // If the game doesn't exist (or doesn't belong to the authenticated user), the API
        // will return a 404 Not Found status.
        return res(
          ctx.status(404)
        )
      }
    }),
    // This illustrates what would happen if a user tried to update an inventory list title
    // after deleting the list on another device or browser. The API would return a 404 and
    // the UI should display a message telling the user the list could not be found and
    // advising them to refresh their browser.
    rest.patch(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    // This illustrates what would happen if a user tried to destroy an inventory list
    // after deleting the list on another device or browser. The API would return a 404 and
    // the UI should display a message telling the user the list could not be found and
    // advising them to refresh their browser.
    rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    }),
    // This illustrates what would happen if a user tried to create an inventory list item on
    // a list after deleting the list on another device or browser. The API would return a 404
    // and the UI should display a message telling the user the list could not be found and
    // advising them to refresh their browser.
    rest.post(`${backendBaseUri}/inventory_lists/:listId/inventory_list_items`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    })
  ]
}

/*
 *
 * When the game has no inventory lists
 * 
 */

export const NoLists = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
      <InventoryListsProvider overrideValue={{ inventoryLists: emptyInventoryLists, inventoryListLoadingState: 'done' }}>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

// This story will not offer the possibility to add inventory list items to lists you create.
// It's just too hard to predict and mock application state so many actions out. It also
// won't offer the ability to create new games from the games dropdown since that triggers
// a GET request to inventory lists and becomes a whole thing.
NoLists.parameters = {
  msw: [
    // This request creates a new inventory list for the given game (if it exists and belongs
    // to the authenticated user). For the purposes of Storybook, we'll assume the user is
    // authenticated and the `games` array represents all their games. Since this story
    // illustrates the case where there are no existing lists for a given game, this API call
    // will always return both an aggregate list and a regular list. That means that if you
    // use the create form multiple times in Storybook between refreshes, you'll end up with
    // multiple aggregate lists + problems.
    rest.post(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const game = games.find(g => g.id === gameId)

      if (game) {
        // If the game exists, the API will create a new inventory list for that game and
        // return a 201 Created status with the inventory list in the response body.
        const title = req.body.inventory_list.title || 'My List 3'

        if (title === 'All Items') {
          return res(
            ctx.status(422),
            ctx.json({
              errors: ['Title cannot be "All Items"']
            })
          )
        } else {
          const list = { id: Math.floor(Math.random() * 10000), game_id: gameId, title, aggregate: false, list_items: [] }
          const aggList = { id: list.id - 1, game_id: gameId, title: 'All Items', aggregate: true, list_items: [] }

          return res(
            ctx.status(201),
            ctx.json([aggList, list])
          )
        }
      } else {
        // If the game doesn't exist (or doesn't belong to the authenticated user), the API
        // will return a 404 Not Found status.
        return res(
          ctx.status(404)
        )
      }
    }),
    // This is included just in case somebody wants to both create and destroy a list in the
    // story.
    rest.patch(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      const listId = parseInt(req.params.id)
      const title = req.body.inventory_list.title || 'My List 2'
      const returnData = { id: listId, user_id: 24, title, aggregate: false, list_items: [] }

      return res(
        ctx.status(200),
        ctx.json(returnData)
      )
    }),
    // This will not work if multiple inventory lists are created and then destroyed - this
    // API response is only valid if the list is the user's last regular list.
    rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
      return res(
        ctx.status(204)
      )
    })
  ]
}

/*
 *
 * When the API data is loading
 *
 */

export const Loading = () => {
  const inventoryLists = allInventoryLists.filter(list => list.game_id === games[0].id)

  return(
    <AppProvider overrideValue={{ profileData, token }}>
      <GamesProvider overrideValue={{ games }}>
        <InventoryListsProvider overrideValue={{ inventoryLists, inventoryListLoadingState: 'loading' }}>
          <InventoryPage />
        </InventoryListsProvider>
      </GamesProvider>
    </AppProvider>
  )
}

/*
 *
 * When there is an error with the API response
 *
 */

export const ErrorState = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games }}>
      <InventoryListsProvider>
        <InventoryPage />
      </InventoryListsProvider>
    </GamesProvider>
  </AppProvider>
)

ErrorState.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      return res(
        ctx.status(500)
      )
    })
  ]
}
