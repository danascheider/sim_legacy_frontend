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
  createShoppingList,
  fetchShoppingLists,
  updateShoppingList,
  destroyShoppingList,
  createShoppingListItem,
  updateShoppingListItem,
  destroyShoppingListItem
} from '../utils/simApi'
import { useAppContext, useGamesContext } from '../hooks/contexts'
import useQuery from '../hooks/useQuery'
import paths from '../routing/paths'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const shoppingListLoadingStates = { LOADING, DONE, ERROR }

const ShoppingListsContext = createContext()

const ShoppingListsProvider = ({ children, overrideValue = {} }) => {
  const queryString = useQuery()

  const {
    token,
    logOutAndRedirect,
    setFlashProps,
    setFlashVisible
  } = useAppContext()

  const { games } = useGamesContext()

  const activeGameId = useMemo(() => {
    if (games && games.length) {
      return parseInt(queryString.get('game_id') || games[0].id)
    } else {
      return null
    }
  }, [games, queryString])

  const [shoppingLists, setShoppingLists] = useState(overrideValue.shoppingLists || [])
  const [shoppingListLoadingState, setShoppingListLoadingState] = useState(LOADING)

  const shoppingListsOverridden = useRef(false)
  
  if (overrideValue.shoppingLists) {
    // Use this as the initial value only so that the shopping
    // lists can be updated when we interact in Storybook or other
    // tests
    delete overrideValue.shoppingLists
    shoppingListsOverridden.current = true
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

  const listFromListItemId = itemId => shoppingLists.find(list => !!list.list_items.find(item => item.id === itemId))

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
    if (token && !shoppingListsOverridden.current) {
      fetchShoppingLists(token, activeGameId)
        .then(({ status, json }) => {
          if (status === 200) {
            if (mountedRef.current) {
              setShoppingLists(json)
              !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(DONE)
            }
          } else {
            const message = json.errors ? `Error ${status} while fetching shopping lists: ${json.errors}` : `Unknown error ${status} while fetching shopping lists`
            throw new Error(message)
          }
        })
        .catch(err => {
          if (err.code === 401) {
            logOutAndRedirect(paths.login, () => mountedRef.current = false)
            // Don't set the loading state because it's redirecting anyway
          } else if (err.code === 404 && mountedRef.current) {
            setFlashProps({
              type: 'error',
              message: "We couldn't find the game you're looking for."
            })

            setFlashVisible(true)

            !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(ERROR)
          } else {
            if (process.env.NODE_ENV === 'development') console.error('Unexpected error fetching shopping lists: ', err)

            if (mountedRef.current) {
              setFlashProps({
                type: 'error',
                message: "There was an unexpected error loading your lists. It may have been on our end. We're sorry!"
              })
              !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(ERROR)
            }
          }
        })
    } else {
      mountedRef.current && !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(DONE)
    }
  }, [token, overrideValue.shoppingListLoadingState, setFlashProps, setFlashVisible, activeGameId, logOutAndRedirect])

  const performShoppingListUpdate = (listId, newTitle, callbacks = {}) => {
    const { onSuccess, onNotFound, onUnprocessableEntity, onUnauthorized, onInternalServerError } = callbacks

    updateShoppingList(token, listId, { title: newTitle })
      .then(({ status, json }) => {
        if (!mountedRef.current) return

        if (status === 200) {
          const newShoppingLists = shoppingLists.map(list => { if (list.id === listId) { return json } else { return list } })
          setShoppingLists(newShoppingLists)
          !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(DONE)
          onSuccess && onSuccess()
        } else if (status === 422) {
          setFlashProps({
            type: 'error',
            message: json.errors,
            header: `${json.errors.length} error(s) prevented your changes from being saved:`
          })

          !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(DONE)

          onUnprocessableEntity && onUnprocessableEntity()
        } else {
          throw new Error(json.errors ? `Error ${status} when updating shopping list: ${json.errors}` : `Unknown error ${status} when updating shopping list`)
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV === 'development') console.error(`Error updating shopping list ${listId}: `, err)

        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error',
            message: "Oops! The shopping list you wanted to update could not be found. Try refreshing the page to fix this issue."
          })

          !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(DONE)
          
          onNotFound && onNotFound()
        } else {
          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to update your shopping list. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(DONE)

          onInternalServerError && onInternalServerError()
        }
      }) 
  }

  const performShoppingListCreate = (title, callbacks = {}) => {
    const { onSuccess, onUnauthorized, onNotFound, onUnprocessableEntity, onInternalServerError } = callbacks

    createShoppingList(token, activeGameId, { title })
      .then(({ status, json }) => {
        if (status === 201) {
          if (Array.isArray(json) && json.length === 2) {
            // It is an array of shopping lists. It includes the shopping list that was
            // created and an aggregate list that was created automatically. This case only
            // arises if there were no existing shopping lists, so in this case, we want
            // to set the shopping lists array to the lists returned.
            setShoppingLists(json)
          } else if (json && typeof json === 'object') {
            // It is the single shopping list that was created. This will happen if there
            // is already an existing aggregate list.
            const newShoppingLists = [...shoppingLists]
            newShoppingLists.splice(1, 0, json)
            setShoppingLists(newShoppingLists)
          }

          onSuccess && onSuccess()
        } else if (status === 422) {
          setFlashProps({
            type: 'error',
            message: json.errors,
            header: `${json.errors.length} error(s) prevented your shopping list from being created:`
          })

          onUnprocessableEntity && onUnprocessableEntity()
        } else {
          // Something unexpected happened and we don't know what
          throw new Error(json.errors ? `Error ${status} while creating shopping list: ${json.errors}` : `Unknown error ${status} while creating shopping list`)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error',
            message: 'The game you wanted to create a shopping list for could not be found. Try refreshing the page to fix this issue.'
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Error creating shopping list: ', err)
          
          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to create your shopping list. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }

  const performShoppingListDestroy = (listId, callbacks = {}) => {
    const { onSuccess, onUnauthorized, onNotFound, onInternalServerError } = callbacks

    destroyShoppingList(token, listId)
      .then(({ status, json }) => {
        if (!mountedRef.current) return

        if (status === 204) {
          // This means that the list was the game's last shopping list and both
          // it and the aggregate list have been destroyed.
          setShoppingLists([])
          
          setFlashProps({
            type: 'success',
            message: 'Since it was your last list, your aggregate list has been deleted as well.',
            header: 'Your shopping list has been deleted.'
          })

          onSuccess && onSuccess()
        } else if (status === 200) {
          // This means that the aggregate list has been updated and returned,
          // to adjust for any items that were deleted with the other list.
          const newShoppingLists = shoppingLists.filter(list => list.id !== listId)
                                                .map(list => (list.aggregate === true ? json : list))

          setShoppingLists(newShoppingLists)

          setFlashProps({
            type: 'success',
            message: 'Your shopping list has been deleted.'
          })

          onSuccess && onSuccess()
        } else {
          const message = json.errors ? `Error ${status} when deleting shopping list: ${json.errors}` : `Unknown error ${status} when deleting shopping list`
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
          setFlashProps({
            type: 'error',
            message: "Oops! We couldn't find the shopping list you wanted to delete. Sorry! Try refreshing the page to solve this problem."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Unexpected error deleting shopping list: ', err.message)

          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to delete your shopping list. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }

  const performShoppingListItemCreate = (listId, attrs, callbacks = {}) => {
    if (!mountedRef.current) return

    const { onSuccess, onNotFound, onUnprocessableEntity, onUnauthorized, onInternalServerError } = callbacks
    const allowedAttributes = ['Description', 'Quantity', 'Notes']

    createShoppingListItem(token, listId, attrs)
      .then(resp => resp.json())
      .then(data => {
        if (!mountedRef.current) return

        if (data && data.length) {
          const [aggregateListItem, regularListItem] = data

          // Have to create an actual new object or the state change won't cause useEffect
          // hooks to run.
          const newLists = [...shoppingLists]
          const aggregateList = shoppingLists[0]
          const regularList = shoppingLists.find(list => list.id === listId)
          const regularListPosition = shoppingLists.indexOf(regularList)

          const newAggregateList = addOrUpdateListItem(aggregateList, aggregateListItem)
          const newRegularList = addOrUpdateListItem(regularList, regularListItem)

          newLists[0] = newAggregateList
          newLists[regularListPosition] = newRegularList

          setShoppingLists(newLists)

          onSuccess && onSuccess()
        } else if (data && typeof data === 'object' && data.errors) {
          // If all the errors returned start with one of the allowed attributes, it's a safe bet that
          // this is a validation error. Otherwise, assume it is a 500.
          if (data.errors.filter(msg => allowedAttributes.indexOf(msg.split(' ')[0]) !== -1).length === data.errors.length) {
            setFlashProps({
              type: 'error',
              message: data.errors,
              header: `${data.errors.length} error(s) prevented your shopping list item from being created:`
            })

            onUnprocessableEntity && onUnprocessableEntity()
          } else {
            throw new Error('Internal Server Error: ' + data.errors[0])
          }
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error',
            message: "Oops! We couldn't find the shopping list you wanted to add an item to. Sorry! Try refreshing the page to solve this problem."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Unexpected error when creating shopping list item: ', err.message)

          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to create your shopping list item. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }

  const performShoppingListItemUpdate = (itemId, attrs, callbacks) => {
    const allowedAttributes = ['Quantity', 'Notes']
    const { onSuccess, onNotFound, onUnprocessableEntity, onUnauthorized, onInternalServerError } = callbacks

    updateShoppingListItem(token, itemId, attrs)
      .then(resp => resp.json())
      .then(data => {
        if (!mountedRef.current) return

        if (Array.isArray(data)) {
          const [aggregateListItem, regularListItem] = data

          let newShoppingLists = [...shoppingLists]

          const regularList = shoppingLists.find(list => list.id === regularListItem.list_id)
          const regularListPosition = shoppingLists.indexOf(regularList)

          const newAggregateList = addOrUpdateListItem(shoppingLists[0], aggregateListItem)
          const newRegularList = addOrUpdateListItem(regularList, regularListItem)

          newShoppingLists[0] = newAggregateList
          newShoppingLists[regularListPosition] = newRegularList

          setShoppingLists(newShoppingLists)

          setFlashProps({ type: 'success', message: 'Success! Your shopping list item was updated.' })

          onSuccess && onSuccess()
        } else if (data && typeof data === 'object' && data.errors) {
          // If all the errors returned start with one of the allowed attributes, then it's safe to say it's
          // a validation error. If not, assume it's a 500.
          if (data.errors.filter(msg => allowedAttributes.indexOf(msg.split(' ')[0]) !== -1).length === data.errors.length) {
            setFlashProps({
              type: 'error',
              message: data.errors,
              header: `${data.errors.length} error(s) prevented your shopping list item from being updated:`
            })

            onUnprocessableEntity && onUnprocessableEntity()
          } else {
            throw new Error('Internal Server Error: ' + data.errors[0])
          }
        } else {
          throw new Error(`Something unexpected went wrong: could not update shopping list item id=${itemId}`)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error',
            message: "Oops! We couldn't find the shopping list item you wanted to update. Sorry! Try refreshing the page to solve this problem."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error(`Unexpected error editing list item ${itemId}: `, err)

          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to update your shopping list item. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }

  const performShoppingListItemDestroy = (itemId, callbacks) => {
    const { onSuccess, onNotFound, onUnauthorized, onInternalServerError } = callbacks

    destroyShoppingListItem(token, itemId)
      .then(resp => {
        if (resp.status === 204) return null

        return resp.json()
      })
      .then(data => {
        const regularListToRemoveItemFrom = listFromListItemId(itemId)
        const regularListIndex = shoppingLists.indexOf(regularListToRemoveItemFrom)
        const newLists = [...shoppingLists]
        let newAggregateList

        if (data && typeof data === 'object' && !data.errors) {
          // It is the aggregate list item that was updated
          newAggregateList = addOrUpdateListItem(shoppingLists[0], data)
        } else if (data && typeof data === 'object' && data.errors) {
          throw new Error('Internal Server Error: ' + data.errors[0])
        } else {
          const deletedItem = regularListToRemoveItemFrom.list_items.find(item => item.id === itemId)

          // It's a bit of a pain in the ass to figure out which item to remove from the aggregate list in
          // the case where it's been deleted. Might be something to think about for API development.
          const aggregateListItem = shoppingLists[0].list_items.find(item => item.description.toLowerCase() === deletedItem.description.toLowerCase())

          newAggregateList = removeItemFromList(shoppingLists[0], aggregateListItem.id)
        }

        const newRegularList = removeItemFromList(regularListToRemoveItemFrom, itemId)

        newLists[0] = newAggregateList
        newLists.splice(regularListIndex, 1, newRegularList)

        setShoppingLists(newLists)
          
        onSuccess && onSuccess()
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect(paths.login, () => {
            mountedRef.current = false
            onUnauthorized && onUnauthorized()
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error', 
            message: "Oops! We couldn't find the shopping list item you wanted to delete. Sorry! Try refreshing the page to solve this problem."
          })

          onNotFound && onNotFound()
        } else {
          if (process.env.NODE_ENV === 'development') console.error('Unexpected error destroying shopping list item: ', err)
          setFlashProps({
            type: 'error', 
            message: "Something unexpected happened while trying to delete your shopping list item. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          onInternalServerError && onInternalServerError()
        }
      })
  }

  const value = {
    shoppingLists,
    shoppingListLoadingState,
    performShoppingListUpdate,
    performShoppingListCreate,
    performShoppingListDestroy,
    performShoppingListItemCreate,
    performShoppingListItemUpdate,
    performShoppingListItemDestroy,
    ...overrideValue
  }

  useEffect(() => {
    if (activeGameId && mountedRef.current) fetchLists()
  }, [fetchLists, activeGameId])

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <ShoppingListsContext.Provider value={value}>
      {children}
    </ShoppingListsContext.Provider>
  )
}

ShoppingListsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  overrideValue: PropTypes.shape({
    shoppingLists: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_id: PropTypes.number,
      title: PropTypes.string.isRequired,
      aggregate: PropTypes.bool.isRequired,
      list_items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        list_id: PropTypes.number,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        notes: PropTypes.string
      })).isRequired
    })),
    shoppingListLoadingState: PropTypes.oneOf([LOADING, DONE, ERROR]),
    performShoppingListUpdate: PropTypes.func,
    performShoppingListCreate: PropTypes.func,
    performShoppingListDestroy: PropTypes.func,
    performShoppingListItemCreate: PropTypes.func,
    performShoppingListItemUpdate: PropTypes.func,
    performShoppingListItemDelete: PropTypes.func
  })
}

export { ShoppingListsContext, ShoppingListsProvider, shoppingListLoadingStates }
