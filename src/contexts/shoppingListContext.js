/*
 *
 * For more information about contexts and how they are used in SIM,
 * visit the docs on SIM contexts (/docs/contexts.md)
 *
 */

import { createContext, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import logOutWithGoogle from '../utils/logOutWithGoogle'
import { fetchShoppingLists, updateShoppingList } from '../utils/simApi'
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

  const value = {
    shoppingLists,
    shoppingListLoadingState,
    performShoppingListUpdate,
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
