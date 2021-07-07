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
  createShoppingListItem
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
            logOutWithGoogle(() => {
              token && removeSessionCookie()
              setShouldRedirectTo(paths.home)
              mountedRef.current = false
              // Don't set the loading state to ERROR because it's redirecting anyway
            })
          } else {
            if (process.env.NODE_ENV !== 'production') console.error('Unexpected error fetching shopping lists: ', err)

            !overrideValue.shoppingListLoadingState && setShoppingListLoadingState(ERROR)
            setFlashProps({
              type: 'error',
              message: "There was an error loading your lists. It may have been on our end. We're sorry!"
            })
            setFlashVisible(true)
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
          setFlashProps({
            type: 'error',
            header: `${data.errors.length} error(s) prevented your changes from being saved:`,
            message: data.errors
          })
          overrideValue.setFlashVisible === undefined && setFlashVisible(true)
          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE) // still just done bc no error thrown
          error && error()
        } else {
          setFlashProps({
            type: 'error',
            message: 'We couldn\'t update your list and we\'re not sure what went wrong. We\'re sorry! Please refresh the page and try again.'
          })
          overrideValue.setFlashVisible === undefined && setFlashVisible(true)
          overrideValue.setShoppingListLoadingState === undefined && setShoppingListLoadingState(DONE) // still just done because no error thrown
          error && error()
        }
      })
      .catch(err => {
        console.error(`Error updating shopping list ${listId}: `, err.message)

        if (err.code === 401) {
          return logOutWithGoogle(() => {
            token && removeSessionCookie()
            setShouldRedirectTo(paths.login)
            mountedRef.current = false
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error',
            message: "Oops! We couldn't find the shopping list you wanted to update. Try refreshing the page to fix this problem."
          })

          overrideValue.setFlashVisible === undefined && setFlashVisible(true)
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

          setFlashProps({
            type: 'success',
            message: 'Success! Your list was created, along with your new master shopping list.'
          })

          setFlashVisible(true)

          success && success()
        } else if (data && typeof data === 'object' && !data.errors) {
          // It is an array of shopping lists but it only contains one. This case means
          // that there was already a master list and only the list the user manually
          // created was created. The new list should be added to the existing shoppingLists
          // array in the second position (after the master list but before any of the others).
          const newShoppingLists = shoppingLists
          newShoppingLists.splice(1, 0, data)
          setShoppingLists(newShoppingLists)

          setFlashProps({
            type: 'success',
            message: 'Success! Your list was created.'
          })

          setFlashVisible(true)

          success && success()
        } else if (data && typeof data === 'object' && data.errors ) {
          setFlashProps({
            type: 'error',
            header: `${data.errors.length} error(s) prevented your shopping list from being created:`,
            message: data.errors
          })

          setFlashVisible(true)

          success && success()
        } else {
          // Something unexpected happened and we don't know what
          throw new Error('There was an unexpected error creating your new list. Unfortunately, we don\'t know more than that yet. We\'re sorry!')
        }
      })
      .catch(err => {
        console.error('Error creating shopping list: ', err.message)

        if (err.code === 401) {
          logOutWithGoogle(() => {
            token && removeSessionCookie()
            setShouldRedirectTo(paths.login)
            mountedRef.current = false
          })
        } else {
          console.error('Unexpected error creating shopping list: ', err.message)

          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to create your shopping list. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          setFlashVisible(true)

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
          setFlashProps({
            type: 'success',
            header: 'Your shopping list has been deleted.',
            message: 'Since it was your last list, your master list has been deleted as well.'
          })

          setFlashVisible(true)

          success && success()
        } else {
          // This means that the master list has been updated and returned,
          // to adjust for any items that were deleted with the other list.
          const newShoppingLists = shoppingLists.map(list => (list.master === true ? data : list))
                                                .filter(list => list && list.id !== listId)

          setShoppingLists(newShoppingLists)

          setFlashProps({
            type: 'success',
            message: 'Your shopping list has been deleted.'
          })

          setFlashVisible(true)

          success && success()
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutWithGoogle(() => {
            token && removeSessionCookie()
            setShouldRedirectTo(paths.login)
            mountedRef.current = false
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error',
            message: "Oops! We couldn't find the shopping list you wanted to delete. Sorry! Try refreshing the page to solve this problem."
          })

          setFlashVisible(true)
          error && error()
        } else {
          console.error('Unexpected error deleting shopping list: ', err.message)

          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to delete your shopping list. Unfortunately, we don't know more than that yet. We're working on it!"
          })

        }
      })
  }

  const performShoppingListItemCreate = (listId, attrs, success = null, error = null) => {
    createShoppingListItem(token, listId, attrs)
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
          const [masterListItem, regularListItem] = data

          const newLists = [...shoppingLists]
          const masterList = { ...shoppingLists[0] }
          const masterListItems = masterList.list_items
          const regularList = { ...shoppingLists.find(list => list.id === listId) }
          const regularListPosition = shoppingLists.indexOf(regularList)
          const regularListItems = regularList.list_items

          // Find the current location of the item on the master list. This is so
          // the item at that index can be removed below and the replacement added
          // at the top of the list.
          let masterIndex
          for (let i = 0; i < masterListItems.length; i++) {
            if (masterListItems[i].id === masterListItem.id) {
              masterIndex = i
              break
            }
          }

          // Check if it's null or undefined because `if (masterIndex) { ... }` was
          // causing this block to be skipped when the masterIndex was 0
          if (masterIndex !== null && masterIndex !== undefined) {
            masterListItems.splice(masterIndex, 1)
          }

          masterListItems.unshift(masterListItem)

          masterList.list_items = masterListItems

          // Replace the master list with the new version of it that has the list
          // item created/updated
          newLists[0] = masterList

          // Find the location of the updated list item in the regular list, if it
          // exists. This will be used to remove the item from its current index and
          // replace it with the updated version at the top of the list.
          let regIndex
          for (let i = 0; i < regularListItems.length; i++) {
            if (regularListItems[i].id === regularListItem.id) {
              regIndex = i
              break
            }
          }

          // Again, 0 will evaluate to false, so we have to check for null or
          // undefined values instead of just `if (regIndex) { ... }`
          if (regIndex !== null && regIndex !== undefined) {
            regularListItems.splice(regIndex, 1)
          }

          // Replace the regular list item that was removed but place the replacement
          // at the top of the list
          regularListItems.unshift(regularListItem)

          regularList.list_items = regularListItems

          // In general, we want the most recently updated lists on top, however, I don't
          // want the whole UI rearranging itself when a user has not yet refreshed the page.
          // Seems like that would cause some frustration if you wanted to do more editing
          // of a list and it moved out from under you.
          newLists[regularListPosition] = regularList

          setShoppingLists(newLists)

          success && success()
        } else if (data && typeof data === 'object' && data.errors) {
          setFlashProps({
            type: 'error',
            header: `${data.errors.length} error(s) prevented your shopping list item from being created:`,
            message: data.errors
          })

          overrideValue.flashVisible === undefined && setFlashVisible(true)

          error && error()
        }
      })
      .catch(err => {
        if (err.code === 401) {
          logOutWithGoogle(() => {
            token && removeSessionCookie()
            setShouldRedirectTo(paths.login)
            mountedRef.current = false
          })
        } else if (err.code === 404) {
          setFlashProps({
            type: 'error',
            message: "Oops! We couldn't find the shopping list you wanted to add an item to. Sorry! Try refreshing the page to solve this problem."
          })
          
          overrideValue.flashVisible === undefined && setFlashVisible(true)
        } else {
          console.error('Unexpected error when creating shopping list item: ', err.message)

          setFlashProps({
            type: 'error',
            message: "Something unexpected happened while trying to create your shopping list item. Unfortunately, we don't know more than that yet. We're working on it!"
          })

          overrideValue.flashVisible === undefined && setFlashVisible(true)
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
    flashProps,
    flashVisible,
    setFlashProps,
    setFlashVisible,
    ...overrideValue
  }

  useEffect(fetchLists, [
    overrideValue.shoppingListLoadingState,
    overrideValue.shoppingLists,
    setShouldRedirectTo,
    removeSessionCookie,
    token
  ])

  useEffect(() => (
    () => { mountedRef.current = false }
  ))

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
    flashProps: PropTypes.shape({
      type: PropTypes.string,
      header: PropTypes.string,
      message: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
    }),
    flashVisible: PropTypes.bool
  })
}

export { ShoppingListContext, ShoppingListProvider}
