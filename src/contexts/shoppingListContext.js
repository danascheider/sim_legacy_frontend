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
  destroyShoppingList,
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
  const [shoppingLists, setShoppingLists] = useState(overrideValue.shoppingLists || [])
  const [listItemEditFormProps, setListItemEditFormProps] = useState({})
  const [listItemEditFormVisible, setListItemEditFormVisible] = useState(false)
  const [flashProps, setFlashProps] = useState({})
  const [flashVisible, setFlashVisible] = useState(false)
  const [shoppingListLoadingState, setShoppingListLoadingState] = useState(LOADING)
  const { token, setShouldRedirectTo, removeSessionCookie } = useAppContext()

  // Use this as the initial value only
  let shoppingListsOverridden = false

  if (overrideValue.shoppingLists) {
    delete overrideValue.shoppingLists
    shoppingListsOverridden = true
  }

  const mountedRef = useRef(true)

  const logOutAndRedirect = () => {
    logOutWithGoogle(() => {
      token && removeSessionCookie()
      setShouldRedirectTo(paths.login)
      mountedRef.current = false
    })
  }

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
    const newList = { ...list }
    const newListItems = [...list.list_items]

    const item = list.list_items.find(item => item.id === itemId)
    const index = list.list_items.indexOf(item)

    newListItems.splice(index, 1)
    newList.list_items = newListItems
    
    return newList
  }
  
  const fetchLists = () => {
    if (token && !shoppingListsOverridden) {
      fetchShoppingLists(token)
        .then(resp => resp.json())
        .then(data => {
          if(data && !data.errors) {
            setShoppingLists(data)
            overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE)
          } else {
            const message = data && data.errors ? 'Internal ServerError: ' + data.errors[0] : 'No shopping list data returned from the SIM API'
            throw new Error(message)
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
    } else {
      overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE)
    }
  }

  const performShoppingListUpdate = (listId, newTitle, success = null, error = null) => {
    updateShoppingList(token, listId, { title: newTitle })
      .then(resp => {
        switch(resp.status) {
          case 200:
          case 422:
          case 500:
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
          // Since only the title can be updated, any validation errors should start with 'Title'.
          // If all the validation errors start with 'Title', assume it's a validation error. If
          // not, assume it's a 500 error.
          if (data.errors.filter(msg => msg.match(/^Title/)).length === data.errors.length) {
            displayFlashError(data.errors, `${data.errors.length} error(s) prevented your changes from being saved:`)
          } else {
            // 500 errors only return a single error message so data.errors[0] is all of them
            throw new Error('Internal Server Error: ' + data.errors[0])
          }

          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE) // still just done bc no error thrown
          error && error()
        } else {
          displayFlashError('We couldn\'t update your list and we\'re not sure what went wrong. We\'re sorry! Please refresh the page and try again.')

          overrideValue.setShoppingListLoadingState === undefined && setShoppingListLoadingState(DONE) // still just done because no error thrown
          error && error()
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV !== 'production') console.error(`Error updating shopping list ${listId}: `, err)

        if (err.code === 401) {
          logOutAndRedirect()
        } else if (err.code === 404) {
          displayFlashError("Oops! We couldn't find the shopping list you wanted to update. Try refreshing the page to fix this problem.")

          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE)
          
          error && error()
        } else {
          displayFlashError("Something unexpected happened while trying to update your shopping list. Unfortunately, we don't know more than that yet. We're working on it!")

          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE)

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
          // created and an aggregate list that was created automatically. This case only
          // arises if there were no existing shopping lists, so in this case, we want
          // to set the shopping lists array to the lists returned.
          setShoppingLists(data)

          displayFlashSuccess('Success! Your list was created, along with your new aggregate shopping list.')

          success && success()
        } else if (data && typeof data === 'object' && !data.errors) {
          // It is an array of shopping lists but it only contains one. This case means
          // that there was already an aggregate list and only the list the user manually
          // created was created. The new list should be added to the existing shoppingLists
          // array in the second position (after the aggregate list but before any of the others).
          const newShoppingLists = shoppingLists
          newShoppingLists.splice(1, 0, data)
          setShoppingLists(newShoppingLists)

          displayFlashSuccess('Success! Your list was created.')

          success && success()
        } else if (data && typeof data === 'object' && data.errors ) {
          // Since we're only setting the title here, all validation errors should start with 'Title'.
          // If all errors start with 'Title', assume it's a validation error. Otherwise, assume it's a
          // 500. This will mess up if the 500 error message starts with 'Title', but I see that scenario
          // as unlikely.
          if (data.errors.filter(msg => msg.match(/^Title/)).length === data.errors.length) {
            displayFlashError(data.errors, `${data.errors.length} error(s) prevented your shopping list from being created:`)
            success && success()
          } else {
            // 500 responses return only one error message so this is all of them.
            throw new Error('Internal Server Error: ' + data.errors[0])
          }
        } else {
          // Something unexpected happened and we don't know what
          throw new Error('There was an unexpected error creating your new list. Unfortunately, we don\'t know more than that yet. We\'re sorry!')
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV !== 'production') console.error('Error creating shopping list: ', err)

        if (err.code === 401) {
          logOutAndRedirect()
        } else {
          displayFlashError("Something unexpected happened while trying to create your shopping list. Unfortunately, we don't know more than that yet. We're working on it!")

          error && error()
        }
      })
  }

  const performShoppingListDestroy = (listId, success = null, error = null) => {
    destroyShoppingList(token, listId)
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
          // it and the aggregate list have been destroyed.
          setShoppingLists([])
          
          displayFlashSuccess(
            'Since it was your last list, your aggregate list has been deleted as well',
            'Your shopping list has been deleted'
          )

          success && success()
        } else if (data && data.errors) {
          throw new Error('Internal Server Error: ' + data.errors[0])
        } else {
          // This means that the aggregate list has been updated and returned,
          // to adjust for any items that were deleted with the other list.
          const newShoppingLists = shoppingLists.map(list => (list.aggregate === true ? data : list))
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
    const allowedAttributes = ['Description', 'Quantity', 'Notes']

    createShoppingListItem(token, listId, attrs)
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
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

          success && success()
        } else if (data && typeof data === 'object' && data.errors) {
          // If all the errors returned start with one of the allowed attributes, it's a safe bet that
          // this is a validation error. Otherwise, assume it is a 500.
          if (data.errors.filter(msg => allowedAttributes.indexOf(msg.split(' ')[0]) !== -1).length === data.errors.length) {
            displayFlashError(data.errors, `${data.errors.length} error(s) prevented your shopping list item from being created:`)
            error && error()
          } else {
            throw new Error('Internal Server Error: ' + data.errors[0])
          }
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

  const performShoppingListItemUpdate = (itemId, attrs, showFlashOnSuccess, success = null, error = null) => {
    const allowedAttributes = ['Quantity', 'Notes']

    updateShoppingListItem(token, itemId, attrs)
      .then(resp => resp.json())
      .then(data => {
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

          setListItemEditFormVisible(false)
          showFlashOnSuccess && displayFlashSuccess('Success! Your shopping list item was updated.')

          success && success()
        } else if (data && typeof data === 'object' && data.errors) {
          // If all the errors returned start with one of the allowed attributes, then it's safe to say it's
          // a validation error. If not, assume it's a 500.
          if (data.errors.filter(msg => allowedAttributes.indexOf(msg.split(' ')[0]) !== -1).length === data.errors.length) {
            setListItemEditFormVisible(false)
            displayFlashError(data.errors, `${data.errors.length} error(s) prevented your shopping list item from being updated:`)
            error && error()
          } else {
            setListItemEditFormVisible(false)
            throw new Error('Internal Server Error: ' + data.errors[0])
          }
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
          displayFlashError('Cannot manually edit item on an aggregate list')
        } else {
          if (process.env.NODE_ENV !== 'production') console.error(`Unexpected error editing list item ${itemId}: `, err)

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
          
        success && success()
      })
      .catch(err => {
        if (err.code === 401) {
          logOutAndRedirect()
        } else if (err.code === 404) {
          displayFlashError("Oops! We couldn't find the shopping list item you wanted to delete. Sorry! Try refreshing the page to solve this problem.")
        } else if (err.code === 405) {
          displayFlashError('Cannot manually remove an item from an aggregate list')
        } else {
          if (process.env.NODE_ENV !== 'production') console.error('Unexpected error destroying shopping list item: ', err)
          displayFlashError("Something unexpected happened while trying to delete your shopping list item. Unfortunately, we don't know more than that yet. We're working on it!")
        }

        error && error()
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
    listItemEditFormVisible,
    setListItemEditFormVisible,
    listItemEditFormProps,
    setListItemEditFormProps,
    flashProps,
    flashVisible,
    setFlashProps,
    setFlashVisible,
    ...overrideValue
  }

  useEffect(() => {
    fetchLists()
    return () => mountedRef.current = false
  }, [])

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
      aggregate: PropTypes.bool.isRequired,
      list_items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        list_id: PropTypes.number,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        notes: PropTypes.string
      })).isRequired
    })),
    shoppingListLoadingState: PropTypes.string,
    performShoppingListUpdate: PropTypes.func,
    performShoppingListCreate: PropTypes.func,
    performShoppingListDestroy: PropTypes.func,
    performShoppingListItemCreate: PropTypes.func,
    performShoppingListItemUpdate: PropTypes.func,
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
