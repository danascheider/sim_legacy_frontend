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

import { createContext, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import logOutWithGoogle from '../utils/logOutWithGoogle'
import {
  createShoppingList,
  fetchShoppingLists,
  updateShoppingList,
  deleteShoppingList,
  createShoppingListItem,
  updateShoppingListItem,
  destroyShoppingListItem
} from '../utils/simApi'
import { useAppContext } from '../hooks/contexts'
import paths from '../routing/paths'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const ShoppingListContext = createContext()

const ShoppingListProvider = ({ children, overrideValue = {} }) => {
  const [shoppingLists, setShoppingLists] = useState(overrideValue.shoppingLists || null)
  const [flashVisible, setFlashVisible] = useState(false)
  const [flashProps, setFlashProps] = useState({})
  const [shoppingListLoadingState, setShoppingListLoadingState] = useState(LOADING)
  const { token, setShouldRedirectTo, removeSessionCookie } = useAppContext()

  const mountedRef = useRef(true)

  const logOutAndRedirect = () => {
    logOutWithGoogle(() => {
      token && removeSessionCookie()
      setShouldRedirectTo(paths.login)
      mountedRef.current = false
    })
  }

  const addOrUpdateListItem = (list, item) => {
    const originalItem = list.list_items.find(listItem => listItem.id === item.id)
    const newListItems = list.list_items
    const newList = list

    if (originalItem) {
      const originalItemPosition = list.list_items.indexOf(originalItem)
      newListItems.splice(originalItemPosition, 1, item)
    } else {
      newListItems.unshift(item)
    }

    newList.list_items = newListItems

    return newList
  }

  const displayFlashError = (msg, header = null) => {
    setFlashProps({
      type: 'error',
      message: msg,
      header: header
    })

    overrideValue.flashVisible === undefined && setFlashVisible(true)
  }
  
  const displayFlashSuccess = (msg, header = null) => {
    setFlashProps({
      type: 'success',
      message: msg,
      header: header
    })

    overrideValue.flashVisible === undefined && setFlashVisible(true)
  }

  const listFromListItemId = itemId => shoppingLists.find(list => !!list.list_items.find(item => item.id === itemId))

  const removeItemFromList = (list, itemId) => {
    const newList = [...list]
    const newListItems = [...list.list_items]

    const item = list.list_items.find(item => item.id === itemId)
    const index = list.list_items.indexOf(item)

    newListItems.splice(index, 1)
    newList.list_items = newListItems
    
    return newList
  }
  
  const fetchLists = () => {
    if (token && !overrideValue.shoppingLists) {
      fetchShoppingLists(token)
        .then(resp => resp.json())
        .then(data => {
          if(data) {
            setShoppingLists(data)
            overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE)
          } else {
            throw new Error('No shopping list data returned from the SIM API')
          }
        })
        .catch(err => {
          if (err.code === 401) {
            logOutAndRedirect()
            // Don't set the loading state because it's redirecting anyway
          } else {
            if (process.env.NODE_ENV !== 'production') console.error('Unexpected error fetching shopping lists: ', err)

            !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(ERROR)
            displayFlashError("There was an error loading your lists. It may have been on our end. We're sorry!")
          }
        })
    }
  }

  const performShoppingListUpdate = (listId, newTitle, success = null, error = null) => {
    updateShoppingList(token, listId, { title: newTitle })
      .then(resp => {
        switch(resp.status) {
          case 200:
          case 422:
            return resp.json()
          default:
            throw Error('Something unexpected went wrong while updating your list.')
        }
      })
      .then(data => {
        if (data && !data.errors) {
          const newShoppingLists = shoppingLists.map(list => { if (list.id === listId) { return data } else { return list } })
          setShoppingLists(newShoppingLists)
          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE)
          success && success()
        } else if (data && data.errors) {
          displayFlashError(data.errors, `${data.errors.length} error(s) prevented your changes from being saved:`)

          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE) // still just done bc no error thrown
          error && error()
        } else {
          displayFlashError('We couldn\'t update your list and we\'re not sure what went wrong. We\'re sorry! Please refresh the page and try again.')

          overrideValue.setShoppingListLoadingState === undefined && setShoppingListLoadingState(DONE) // still just done because no error thrown
          error && error()
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV !== 'production') console.error(`Error updating shopping list ${listId}: `, err.message)

        if (err.code === 401) {
          logOutAndRedirect()
        } else if (err.code === 404) {
          displayFlashError("Oops! We couldn't find the shopping list you wanted to update. Try refreshing the page to fix this problem.")

          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE)
          
          error && error()
        } else {
          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(ERROR)

          error && error()
        }
      }) 
  }

  const performShoppingListCreate = (title, success = null, error = null) => {
    createShoppingList(token, { title })
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data) && data.length === 2) {
          // It is an array of shopping lists. It includes the shopping list that was
          // created and a master list that was created automatically. This case only
          // arises if there were no existing shopping lists, so in this case, we want
          // to set the shopping lists array to the lists returned.
          setShoppingLists(data)

          displayFlashSuccess('Success! Your list was created, along with your new master shopping list.')

          success && success()
        } else if (data && typeof data === 'object' && !data.errors) {
          // It is an array of shopping lists but it only contains one. This case means
          // that there was already a master list and only the list the user manually
          // created was created. The new list should be added to the existing shoppingLists
          // array in the second position (after the master list but before any of the others).
          const newShoppingLists = shoppingLists
          newShoppingLists.splice(1, 0, data)
          setShoppingLists(newShoppingLists)

          displayFlashSuccess('Success! Your list was created.')

          success && success()
        } else if (data && typeof data === 'object' && data.errors ) {
          displayFlashError(data.errors, `${data.errors.length} error(s) prevented your shopping list from being created:`)

          success && success()
        } else {
          // Something unexpected happened and we don't know what
          throw new Error('There was an unexpected error creating your new list. Unfortunately, we don\'t know more than that yet. We\'re sorry!')
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV !== 'production') console.error('Error creating shopping list: ', err.message)

        if (err.code === 401) {
          logOutAndRedirect()
        } else {
          if (process.env.NODE_ENV !== 'production') console.error('Unexpected error creating shopping list: ', err.message)

          displayFlashError("Something unexpected happened while trying to create your shopping list. Unfortunately, we don't know more than that yet. We're working on it!")

          error && error()
        }
      })
  }

  const performShoppingListDelete = (listId, success = null, error = null) => {
    deleteShoppingList(token, listId)
      .then(resp => {
        // Error responses, including 404 and 405 responses, result
        // in a NotFoundError or MethodNotAllowedError to be thrown
        // (respectively).
        if (resp.status === 204) {
          return null
        } else {
          return resp.json()
        }
      })
      .then(data => {
        if (!data) {
          // This means that the list was the user's last shopping list and both
          // it and the master list have been destroyed.
          setShoppingLists([])
          
          displayFlashSuccess(
            'Since it was your last list, your master list has been deleted as well',
            'Your shopping list has been deleted'
          )

          success && success()
        } else {
          // This means that the master list has been updated and returned,
          // to adjust for any items that were deleted with the other list.
          const newShoppingLists = shoppingLists.map(list => (list.master === true ? data : list))
                                                .filter(list => list && list.id !== listId)

          setShoppingLists(newShoppingLists)

          displayFlashSuccess('Your shopping list has been deleted.')

          success && success()
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect()
        } else if (err.code === 404) {
          displayFlashError("Oops! We couldn't find the shopping list you wanted to delete. Sorry! Try refreshing the page to solve this problem.")
        } else {
          if (process.env.NODE_ENV !== 'production') console.error('Unexpected error deleting shopping list: ', err.message)

          displayFlashError("Something unexpected happened while trying to delete your shopping list. Unfortunately, we don't know more than that yet. We're working on it!")
        }
        
        error && error()
      })
  }

  const performShoppingListItemCreate = (listId, attrs, success = null, error = null) => {
    createShoppingListItem(token, listId, attrs)
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
          const [masterListItem, regularListItem] = data

          // Have to create an actual new object or the state change won't cause useEffect
          // hooks to run.
          const newLists = [...shoppingLists]
          const masterList = shoppingLists[0]
          const regularList = shoppingLists.find(list => list.id === listId)
          const regularListPosition = shoppingLists.indexOf(regularList)

          const newMasterList = addOrUpdateListItem(masterList, masterListItem)
          const newRegularList = addOrUpdateListItem(regularList, regularListItem)

          newLists[0] = newMasterList
          newLists[regularListPosition] = newRegularList

          setShoppingLists(newLists)

          success && success()
        } else if (data && typeof data === 'object' && data.errors) {
          displayFlashError(data.errors, `${data.errors.length} error(s) prevented your shopping list item from being created:`)

          error && error()
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect()
        } else if (err.code === 404) {
          displayFlashError("Oops! We couldn't find the shopping list you wanted to add an item to. Sorry! Try refreshing the page to solve this problem.")
        } else {
          if (process.env.NODE_ENV !== 'production') console.error('Unexpected error when creating shopping list item: ', err.message)

          displayFlashError("Something unexpected happened while trying to create your shopping list item. Unfortunately, we don't know more than that yet. We're working on it!")
        }

        error && error()
      })
  }

  const performShoppingListItemUpdate = (itemId, attrs, success = null, error = null) => {
    updateShoppingListItem(token, itemId, attrs)
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
          const [masterListItem, regularListItem] = data

          let newShoppingLists = [...shoppingLists]

          const regularList = shoppingLists.find(list => list.id === regularListItem.list_id)
          const regularListPosition = shoppingLists.indexOf(regularList)

          const newMasterList = addOrUpdateListItem(shoppingLists[0], masterListItem)
          const newRegularList = addOrUpdateListItem(regularList, regularListItem)
          
          newShoppingLists[0] = newMasterList
          newShoppingLists[regularListPosition] = newRegularList

          setShoppingLists(newShoppingLists)

          success && success()
        } else if (data && typeof data === 'object' && data.errors) {
          displayFlashError(data.errors, `${data.errors.length} error(s) prevented your shopping list item from being updated:`)

          error && error()
        } else {
          throw new Error(`Something unexpected went wrong: could not update shopping list item id=${itemId}`)
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect()
        } else if (err.code === 404) {
          displayFlashError("Oops! We couldn't find the shopping list item you wanted to update. Sorry! Try refreshing the page to solve this problem.")
        } else if (err.code === 405) {
          displayFlashError('Cannot manually edit item on a master list')
        } else {
          if (process.env.NODE_ENV !== 'production') console.error(`Unexpected error editing list item ${itemId}: `, err.message)

          displayFlashError("Something unexpected happened while trying to update your shopping list item. Unfortunately, we don't know more than that yet. We're working on it!")
        }

        error && error()
      })
  }

  const performShoppingListItemDestroy = (itemId, success = null, error = null) => {
    destroyShoppingListItem(token, itemId)
      .then(resp => {
        if (resp.status === 204) return null

        return resp.json()
      })
      .then(data => {
        const regularListToRemoveItemFrom = listFromListItemId(itemId)
        const regularListIndex = shoppingLists.indexOf(regularListToRemoveItemFrom)
        const newLists = [...shoppingLists]
        let newMasterList

        if (data && typeof data === 'object') {
          // It is the master list item that was updated
          newMasterList = addOrUpdateListItem(shoppingLists[0], data)
        } else {
          const deletedItem = regularListToRemoveItemFrom.list_items.find(item => item.id === itemId)

          // It's a bit of a pain in the ass to figure out which item to remove from the master list in
          // the case where it's been deleted. Might be something to think about for API development.
          const masterListItem = shoppingLists[0].list_items.find(item => item.description.match(new RegExp(deletedItem.description, 'i')))

          newMasterList = removeItemFromList(shoppingLists[0], masterListItem)
        }

        const newRegularList = removeItemFromList(regularListToRemoveItemFrom, itemId)

        newLists[0] = newMasterList
        newLists.splice(regularListIndex, 1, newRegularList)

        setShoppingLists(newLists)
  
        displayFlashSuccess('Your list item has been deleted. Your master list was updated to reflect the change.')
        
        success && success()
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect()
        } else if (err.code === 404) {
          displayFlashError("Oops! We couldn't find the shopping list item you wanted to delete. Sorry! Try refreshing the page to solve this problem.")
        } else if (err.code === 405) {
          displayFlashError('Cannot manually remove an item from a master list')
        }

        error && error()
      })
  }

  const value = {
    shoppingLists,
    shoppingListLoadingState,
    performShoppingListUpdate,
    performShoppingListCreate,
    performShoppingListDelete,
    performShoppingListItemCreate,
    performShoppingListItemUpdate,
    performShoppingListItemDestroy,
    flashProps,
    flashVisible,
    setFlashProps,
    setFlashVisible,
    ...overrideValue
  }

  useEffect(() => {
    fetchLists()
    return () => mountedRef.current = false
  }, [
    overrideValue.shoppingListLoadingState,
    overrideValue.shoppingLists,
    setShouldRedirectTo,
    removeSessionCookie,
    token
  ])

  return(
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  )
}

ShoppingListProvider.propTypes = {
  children: PropTypes.node.isRequired,
  overrideValue: PropTypes.shape({
    shoppingLists: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_id: PropTypes.number,
      title: PropTypes.string.isRequired,
      list_items: PropTypes.arrayOf({
        id: PropTypes.number,
        shopping_list_id: PropTypes.number,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        notes: PropTypes.string
      }).isRequired
    })),
    shoppingListLoadingState: PropTypes.string,
    performShoppingListUpdate: PropTypes.func,
    performShoppingListCreate: PropTypes.func,
    performShoppingListDelete: PropTypes.func,
    performShoppingListItemCreate: PropTypes.func,
    performShoppingListItemDelete: PropTypes.func,
    flashProps: PropTypes.shape({
      type: PropTypes.string,
      header: PropTypes.string,
      message: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
    }),
    flashVisible: PropTypes.bool
  })
}

export { ShoppingListContext, ShoppingListProvider}
