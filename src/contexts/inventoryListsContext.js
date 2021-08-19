/*
 *
 * For more information about contexts and how they are used in SIM,
 * visit the docs on SIM contexts (/docs/contexts.md)
 * 
 * This context makes heavy use of the SIM API. The requests it makes are
 * mediated through the simApi module (/src/utils/simApi.js). To get information
 * about the API, its requirements, and its responses, visit the docs:
 * https://github.com/danascheider/skyrim_inventory_management/tree/main/docs/api
 *
 */

import {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react'
import PropTypes from 'prop-types'
import {
  fetchInventoryLists,
  createInventoryList,
  updateInventoryList,
  destroyInventoryList,
  createInventoryListItem,
  updateInventoryListItem,
  destroyInventoryListItem
} from '../utils/simApi'
import { LOADING, DONE, ERROR } from '../utils/loadingStates'
import { useAppContext, useGamesContext } from '../hooks/contexts'
import useQuery from '../hooks/useQuery'
import paths from '../routing/paths'

const InventoryListsContext = createContext()

const InventoryListsProvider = ({ children, overrideValue = {} }) => {
  const queryString = useQuery()

  const { token, logOutAndRedirect, setFlashAttributes, setFlashVisible } = useAppContext()
  const { games } = useGamesContext()

  const activeGameId = useMemo(() => {
    if (games && games.length) {
      return parseInt(queryString.get('game_id') || games[0].id)
    } else {
      return null
    }
  }, [games, queryString])

  const [inventoryLists, setInventoryLists] = useState(overrideValue.inventoryLists || [])
  const [inventoryListLoadingState, setInventoryListLoadingState] = useState(LOADING)

  const inventoryListsOverridden = useRef(false)

  if (overrideValue.inventoryLists) {
    // Use this as the initial value only so that the inventory
    // lists can be updated when we interact in Storybook or other
    // tests
    delete overrideValue.inventoryLists
    inventoryListsOverridden.current = true
  }

  const mountedRef = useRef(true)

  const addOrUpdateListItem = (list, item) => {
    const originalItem = list.list_items.find(listItem => listItem.description.toLowerCase() === item.description.toLowerCase())
    const newListItems = [...list.list_items]

    if (originalItem) {
      const originalItemPosition = list.list_items.indexOf(originalItem)
      newListItems.splice(originalItemPosition, 1, item)
    } else {
      newListItems.unshift(item)
    }

    list.list_items = newListItems

    return { ...list }
  }

  const listFromItemId = useCallback(itemId => inventoryLists.find(list => !!list.list_items.find(item => item.id === itemId)), [inventoryLists])

  const removeItemFromList = (list, itemId) => {
    const newList = { ...list }
    const newListItems = [...list.list_items]

    const item = list.list_items.find(item => item.id === itemId)
    const index = list.list_items.indexOf(item)

    newListItems.splice(index, 1)
    newList.list_items = newListItems
    
    return newList
  }

  const fetchLists = useCallback(() => {
    if (token && !inventoryListsOverridden.current) {
      fetchInventoryLists(token, activeGameId)
        .then(({ status, json }) => {
          if (!mountedRef.current) return

          if (status === 200) {
            setInventoryLists(json)

            !overrideValue.inventoryListLoadingState && setInventoryListLoadingState(DONE)
          } else {
            const message = json.errors ? `Error ${status} while fetching inventory lists: ${json.errors}` : `Unknown error ${status} while fetching inventory lists`
            throw new Error(message)
          }
        })
        .catch(err => {
          if (err.code === 401) {
            logOutAndRedirect(paths.login, () => mountedRef.current = false)
          } else if (err.code === 404 && mountedRef.current) {
            setFlashAttributes({
              type: 'error',
              message: "We couldn't find the game you're looking for."
            })

            setFlashVisible(true)

            !overrideValue.inventoryListLoadingState && setInventoryListLoadingState(ERROR)
          } else {
            if (process.env.NODE_ENV === 'development') console.error('Unexpected error fetching inventory lists: ', err)

            if (mountedRef.current) {
              !overrideValue.inventoryListLoadingState && setInventoryListLoadingState(ERROR)
            }
          }
        })
    }
  }, [token, logOutAndRedirect, setFlashAttributes, setFlashVisible, overrideValue.inventoryListLoadingState, activeGameId])

  const performInventoryListCreate = useCallback((title, callbacks = {}) => {
    const { onSuccess, onNotFound, onUnprocessableEntity, onUnauthorized, onInternalServerError } = callbacks

    createInventoryList(token, activeGameId, { title })
      .then(({ status, json }) => {
        if (status === 201) {
          if (Array.isArray(json) && json.length === 2) {
            // It is an array of inventory lists. It includes the inventory list that was
            // created and an aggregate list that was created automatically. This case only
            // arises if there were no existing inventory lists, so in this case, we want
            // to set the inventory lists array to the lists returned.
            setInventoryLists(json)
          } else if (json && typeof json === 'object') {
            // It is the single inventory list that was created. This will happen if there
            // is already an existing aggregate list.
            const newInventoryLists = [...inventoryLists]
            newInventoryLists.splice(1, 0, json)
            setInventoryLists(newInventoryLists)
          }

          setFlashAttributes({
            type: 'success',
            message: 'Success! Your inventory list was created.',
          })

          onSuccess && onSuccess()
        } else if (status === 422) {
          setFlashAttributes({
            type: 'error',
            message: json.errors,
            header: `${json.errors.length} error(s) prevented your inventory list from being created:`
          })

          onUnprocessableEntity && onUnprocessableEntity()
        } else {
          throw new Error(json.errors ? `Error ${status} while creating inventory list: ${json.errors}` : `Unknown error ${status} while creating inventory list`)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashAttributes({
            type: 'error',
            message: 'The game you wanted to create an inventory list for could not be found. Try refreshing the page to fix this issue.'
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Error creating inventory list: ', err)

          setFlashAttributes({
            type: 'error',
            message: "Something unexpected happened while trying to create your inventory list. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, activeGameId, setFlashAttributes, inventoryLists, logOutAndRedirect])

  const performInventoryListUpdate = useCallback((listId, title, callbacks = {}) => {
    const { onSuccess, onNotFound, onUnprocessableEntity, onUnauthorized, onInternalServerError } = callbacks

    updateInventoryList(token, listId, { title })
      .then(({ status, json }) => {
        if (!mountedRef.current) return

        if (status === 200) {
          const newInventoryLists = inventoryLists.map(list => list.id === listId ? json : list)
          setInventoryLists(newInventoryLists)
          onSuccess && onSuccess()
        } else if (status === 422) {
          setFlashAttributes({
            type: 'error',
            message: json.errors,
            header: `${json.errors.length} error(s) prevented your changes from beings saved:`
          })

          onUnprocessableEntity && onUnprocessableEntity()
        } else {
          throw new Error(json.errors ? `Error ${status} when updating inventory list: ${json.errors}` : `Unknown error ${status} when updating inventory list`)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashAttributes({
            type: 'error',
            message: "Oops! We couldn't find the inventory list you wanted to update. Try refreshing the page to fix this issue."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error(`Error updating inventory list ${listId}: `, err)

          setFlashAttributes({
            type: 'error',
            message: "Something unexpected happened while trying to update your inventory list. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, inventoryLists, logOutAndRedirect, setFlashAttributes])

  const performInventoryListDestroy = useCallback((listId, callbacks = {}) => {
    const { onSuccess, onNotFound, onInternalServerError, onUnauthorized } = callbacks

    destroyInventoryList(token, listId)
      .then(({ status, json }) => {
        if (!mountedRef.current) return

        if (status === 204) {
          // This means that the list was the game's last inventory list and both
          // it and the aggregate list have been destroyed.
          setInventoryLists([])

          setFlashAttributes({
            type: 'success',
            header: 'Success! Your inventory list has been deleted.',
            message: 'Since it was your last list for this game, the "All Items" list has been deleted as well.'
          })

          onSuccess && onSuccess()
        } else if (status === 200) {
          // This means that the aggregate list has been updated and returned,
          // to adjust for any items that were deleted with the other list.
          const newInventoryLists = inventoryLists.filter(list => list.id !== listId)
                                                  .map(list => list.aggregate === true ? json : list)
          setInventoryLists(newInventoryLists)

          setFlashAttributes({
            type: 'success',
            message: 'Your inventory list has been deleted.'
          })

          onSuccess && onSuccess()
        } else {
          const message = json.errors ? `Error ${status} when deleting inventory list ${listId}: ${json.errors}` : `Unknown error ${status} when deleting inventory list ${listId}`
          throw new Error(message)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashAttributes({
            type: 'error',
            message: "Oops! We couldn't find the inventory list you wanted to delete. Sorry! Try refreshing the page to solve this issue."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error(`Error destroying inventory list ${listId}: `, err)

          setFlashAttributes({
            type: 'error',
            message: "Something unexpected happened while trying to delete your inventory list. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, inventoryLists, logOutAndRedirect, setFlashAttributes])

  const performInventoryListItemCreate = useCallback((listId, attrs, callbacks = {}) => {
    const { onSuccess, onNotFound, onUnprocessableEntity, onUnauthorized, onInternalServerError } = callbacks

    createInventoryListItem(token, listId, attrs)
      .then(({ status, json }) => {
        if (!mountedRef.current) return

        if (status === 200 || status === 201) {
          // Have to create an actual new object or the state change won't cause useEffect
          // hooks to run.
          const newLists = [...inventoryLists]

          // The JSON object returned from this endpoint is the array of all items
          // that have been updated while handling this request. Because changing the
          // `unit_weight` of an inventory list item can cause items other than the
          // list item edited and the aggregate list item to be updated, it's not
          // possible to know for sure how many items the array will contain. It will
          // be at least two though.
          for (let i = 0; i < json.length; i++) {
            const list = inventoryLists.find(list => list.id === json[i].list_id)
            const listPosition = inventoryLists.indexOf(list)
            const newList = addOrUpdateListItem(list, json[i])

            newLists[listPosition] = newList
          }

          setInventoryLists(newLists)

          if (status === 201) {
            setFlashAttributes({
              type: 'success',
              message: 'Success! Your inventory list item has been created.'
            })
          } else {
            setFlashAttributes({
              type: 'success',
              message: 'Success! Your new inventory list item has been combined with another item with the same description.'
            })
          }

          onSuccess && onSuccess()
        } else if (status === 422) {
          setFlashAttributes({
            type: 'error',
            header: `${json.errors.length} error(s) prevented your list item from being created:`,
            message: json.errors
          })

          onUnprocessableEntity && onUnprocessableEntity()
        } else {
          const message = json.errors && json.errors.length ? `Error ${status} creating list item for inventory list ${listId}: ${json.errors}` : `Unknown error ${status} creating list item for inventory list ${listId}`
          throw new Error(message)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashAttributes({
            type: 'error',
            message: "Oops! We couldn't find the inventory list you wanted to add an item to. Sorry! Try refreshing the page to solve this issue."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Error creating inventory list item: ', err)

          setFlashAttributes({
            type: 'error',
            message: "Something unexpected happened while trying to create your inventory list item. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, inventoryLists, logOutAndRedirect, setFlashAttributes])

  const performInventoryListItemUpdate = useCallback((itemId, attrs, callbacks = {}) => {
    const { onSuccess, onNotFound, onUnprocessableEntity, onInternalServerError, onUnauthorized } = callbacks

    updateInventoryListItem(token, itemId, attrs)
      .then(({ status, json }) => {
        if (!mountedRef.current) return

        if (status === 200) {
          let newInventoryLists = [...inventoryLists]

          for (let i = 0; i < json.length; i++) {
            const list = inventoryLists.find(list => list.id === json[i].list_id)
            const newList = addOrUpdateListItem(list, json[i])
            const listPosition = inventoryLists.indexOf(list)
            newInventoryLists[listPosition] = newList
          }
          
          setInventoryLists(newInventoryLists)
          setFlashAttributes({ type: 'success', message: 'Success! Your inventory list item was updated.' })

          onSuccess && onSuccess()
        } else {
          const message = json && json.errors && json.errors.length ? `Error ${status} updating inventory list item ${itemId}: ${json.errors}` : `Unknown error ${status} when updating inventory list item ${itemId}`
          throw new Error(message)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashAttributes({
            type: 'error',
            message: "Oops! We couldn't find the inventory list item you wanted to update. Try refreshing the page to fix this issue."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error(`Error updating inventory list item ${itemId}: `, err)

          setFlashAttributes({
            type: 'error',
            message: "Something unexpected happened while trying to update your inventory list item. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, inventoryLists, setFlashAttributes, logOutAndRedirect])

  const performInventoryListItemDestroy = useCallback((itemId, callbacks = {}) => {
    const { onSuccess, onNotFound, onInternalServerError, onUnauthorized } = callbacks

    destroyInventoryListItem(token, itemId)
      .then(({ status, json }) => {
        if (status === 200 || status === 204) {
          const regularListToRemoveItemFrom = listFromItemId(itemId)
          const regularListIndex = inventoryLists.indexOf(regularListToRemoveItemFrom)
          const newLists = [...inventoryLists]
          let newAggregateList

          if (status === 200) {
            newAggregateList = addOrUpdateListItem(inventoryLists[0], json)
          } else {
            const deletedItem = regularListToRemoveItemFrom.list_items.find(item => item.id === itemId)
            const aggregateListItem = inventoryLists[0].list_items.find(item => item.description.toLowerCase() === deletedItem.description.toLowerCase())

            newAggregateList = removeItemFromList(inventoryLists[0], aggregateListItem.id)
          }

          const newRegularList = removeItemFromList(regularListToRemoveItemFrom, itemId)

          newLists[0] = newAggregateList
          newLists.splice(regularListIndex, 1, newRegularList)

          setInventoryLists(newLists)

          onSuccess && onSuccess()
        } else {
          const message = json && json.errors && json.errors.length ? `Error ${status} updating inventory list item ${itemId}: ${json.errors}` : `Error ${status} updating inventory list item ${itemId}`
          throw new Error(message)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashAttributes({
            type: 'error',
            message: "Oops! We couldn't find the inventory list item you wanted to delete. Try refreshing the page to fix this issue."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error(`Unexpected error deleting list item ${itemId}: `, err)

          setFlashAttributes({
            type: 'error',
            message: "Something unexpected happened while trying to delete your inventory list item. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }, [token, inventoryLists, listFromItemId, logOutAndRedirect, setFlashAttributes])

  const value = {
    inventoryLists,
    inventoryListLoadingState,
    performInventoryListCreate,
    performInventoryListUpdate,
    performInventoryListDestroy,
    performInventoryListItemCreate,
    performInventoryListItemUpdate,
    performInventoryListItemDestroy,
    ...overrideValue
  }

  useEffect(() => {
    if (activeGameId && mountedRef.current) fetchLists()
  }, [fetchLists, activeGameId])

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <InventoryListsContext.Provider value={value}>
      {children}
    </InventoryListsContext.Provider>
  )
}

InventoryListsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  overrideValue: PropTypes.shape({
    inventoryLists: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      game_id: PropTypes.number,
      title: PropTypes.string.isRequired,
      aggregate: PropTypes.bool.isRequired,
      list_items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        list_id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        notes: PropTypes.string,
        unit_weight: PropTypes.number
      })).isRequired
    })),
    inventoryListLoadingState: PropTypes.oneOf([LOADING, DONE, ERROR]),
    performInventoryListCreate: PropTypes.func,
    performInventoryListUpdate: PropTypes.func,
    performInventoryListDestroy: PropTypes.func,
    performInventoryListItemCreate: PropTypes.func,
    performInventoryListItemUpdate: PropTypes.func,
    performInventoryListItemDestroy: PropTypes.func
  })
}

export { InventoryListsContext, InventoryListsProvider }
