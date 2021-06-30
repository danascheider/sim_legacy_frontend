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
import { createShoppingList, fetchShoppingLists, updateShoppingList } from '../utils/simApi'
import { useDashboardContext } from '../hooks/contexts'
import paths from '../routing/paths'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const ShoppingListContext = createContext()

const ShoppingListProvider = ({ children, overrideValue = {} }) => {
  const [shoppingLists, setShoppingLists] = useState(overrideValue.shoppingLists)
  const [flashVisible, setFlashVisible] = useState(false)
  const [flashProps, setFlashProps] = useState({})
  const [shoppingListLoadingState, setShoppingListLoadingState] = useState(LOADING)
  const { token, setShouldRedirectTo, removeSessionCookie } = useDashboardContext()

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
          console.error('Error fetching shopping lists: ', err.message)

          if (err.code === 401) {
            logOutWithGoogle(() => {
              token && removeSessionCookie()
              setShouldRedirectTo(paths.home)
              mountedRef.current = false
              // Don't set the loading state to ERROR because it's redirecting anyway
            })
          } else {
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
          case 404:
            setFlashProps({
              type: 'error',
              message: 'Shopping list could not be updated. Try refreshing to fix this problem.'
            })

            !overrideValue.setFlashVisible && setFlashVisible(true)

            return null
          default:
            throw Error(`Something unexpected went wrong while updating list ${listId}`)
        }
      })
      .then(data => {
        if (data && !data.errors) {
          const newShoppingLists = shoppingLists.map(list => { if (list.id === listId) { return data } else { return list } })
          setShoppingLists(newShoppingLists)
          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE)
          success && success()
        } else if (data && data.errors && data.errors.title) {
          setFlashProps({
            type: 'error',
            header: `${data.errors.title.length} error(s) prevented your changes from being saved:`,
            message: data.errors.title.map(msg => `Title ${msg}`)
          })
          overrideValue.setFlashVisible === undefined && setFlashVisible(true)
          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(DONE) // still just done bc no error thrown
          error && error()
        } else if (data && data.errors) {
          setFlashProps({
            type: 'error',
            message: 'We couldn\'t update your list and we\'re not sure what went wrong. We\'re sorry! Please refresh the page and try again.'
          })
          overrideValue.setFlashVisible === undefined && setFlashVisible(true)
          overrideValue.setShoppingListLoadingState === undefined && setShoppingListLoadingState(DONE) // still just done because no error thrown
          error && error()
        } // no else because if data is null that's been dealt with
      })
      .catch(err => {
        console.error(`Error updating shopping list ${listId}: `, err.message)

        if (err.code === 401) {
          return logOutWithGoogle(() => {
            token && removeSessionCookie()
            setShouldRedirectTo(paths.login)
            mountedRef.current = false
          })
        } else {
          overrideValue.shoppingListLoadingState === undefined && setShoppingListLoadingState(ERROR)
        }
      }) 
  }

  // Note that the success callback will be executed if the API response didn't error
  // out or return a 401. That means it will still run if the list could not be
  // created. Only when the API call raises an actual error will the error callback
  // be called instead. The error callback will not run on a 401 error because that
  // triggers a redirect.
  const performShoppingListCreate = (title, success = null, error = null) => {
    createShoppingList(token, { title })
      .then(resp => resp.json())
      .then(data => {
        if (data.length === 2) {
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
        } else if (Array.isArray(data)) {
          // It is an array of shopping lists but it only contains one. This case means
          // that there was already a master list and only the list the user manually
          // created was created. The new list should be added to the existing shoppingLists
          // array in the second position (after the master list but before any of the others).
          const newShoppingLists = shoppingLists
          newShoppingLists.splice(1, 0, data[0])
          setShoppingLists(newShoppingLists)

          setFlashProps({
            type: 'success',
            message: 'Success! Your list was created.'
          })

          success && success()
          setFlashVisible(true)
        } else if (data && data.errors && data.errors.title) {
          // The list couldn't be created because of errors. Since "title" is the only field
          // the UI provides where there could be errors, we'll just assume that's the only
          // place in this object to find the error messages. Note that in this case the response
          // body will be an object and not an array, since the master list won't be created anyway
          // if creation of this item fails.
          setFlashProps({
            type: 'error',
            header: `${data.errors.title.length} error(s) prevented your changes from being saved:`,
            message: data.errors.title.map(msg => `Title ${msg}`)
          })
          setFlashVisible(true)

          success && success()
        } else if (data && data.message) {
          // Something unexpected happened and it's going to tell us what
          console.error('Error returned from the SIM API: ', data.message)
          // Don't show the user the actual error message. In my present case
          // it's "Cannot read property 'get' of undefined", which will surely
          // be even more maddening for nontechnical users than it is for me.
          throw new Error('There was an unexpected error creating your new list. Unfortunately, we don\'t know more than that yet. We\'re sorry!')
        } else {
          // Something unexpected happened and we don't know what
          throw new Error('There was an unexpected error creating your new list. Unfortunately we don\'t know more than that yet. We\'re sorry!')
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
          setFlashProps({
            type: 'error',
            message: err.message
          })
          setFlashVisible(true)
          error && error()
        }
      })
  }

  const value = {
    shoppingLists,
    shoppingListLoadingState,
    performShoppingListUpdate,
    performShoppingListCreate,
    flashProps,
    flashVisible,
    ...overrideValue
  }

  useEffect(fetchLists, [])
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
      shoppingListItems: PropTypes.arrayOf({
        id: PropTypes.number,
        shopping_list_id: PropTypes.number,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        notes: PropTypes.string
      }).isRequired
    })),
    shoppingListLoadingState: PropTypes.string,
    performShoppingListUpdate: PropTypes.func,
    flashProps: PropTypes.shape({
      type: PropTypes.string,
      header: PropTypes.string,
      message: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
    }),
    flashVisible: PropTypes.bool
  })
}

export { ShoppingListContext, ShoppingListProvider}
