/*
 *
 * For more information about contexts and how they are used in SIM,
 * visit the docs on SIM contexts (/docs/contexts.md)
 *
 */


import { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import logOutWithGoogle from '../utils/logOutWithGoogle'
import { fetchShoppingLists, updateShoppingList } from '../utils/simApi'
import { useDashboardContext } from '../hooks/contexts'
import paths from '../routing/paths'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const ShoppingListContext = createContext()

const ShoppingListProvider = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState(null)
  const [flashVisible, setFlashVisible] = useState(false)
  const [flashProps, setFlashProps] = useState({})
  const [shoppingListLoadingState, setShoppingListLoadingState] = useState(LOADING)
  const { token, setShouldRedirectTo, removeSessionCookie } = useDashboardContext()
  
  const fetchLists = () => {
    if (token) {
      fetchShoppingLists(token)
        .then(resp => resp.json())
        .then(data => {
          if(data) {
            setShoppingLists(data)
            setShoppingListLoadingState(DONE)
          } else {
            return new Error('No shopping list data returned from the SIM API')
          }
        })
        .catch(err => {
          console.error('Error fetching shopping lists: ', err.message)

          if (err.name === 'AuthorizationError') {
            logOutWithGoogle(() => {
              token && removeSessionCookie()
              setShouldRedirectTo(paths.home)
            })
          } else {
            setShoppingListLoadingState(ERROR)
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

            setFlashVisible(true)

            return null
          default:
            throw Error(`Something unexpected went wrong while updating list ${listId}`)
        }
      })
      .then(data => {
        if (data && !data.errors) {
          const newShoppingLists = shoppingLists.map(list => { if (list.id === listId) { return data } else { return list } })
          setShoppingLists(newShoppingLists)
          success && success()
        } else if (data && data.errors && data.errors.title) {
          setFlashProps({
            type: 'error',
            header: `${data.errors.title.length} error(s) prevented your changes from being saved:`,
            message: data.errors.title.map(msg => `Title ${msg}`)
          })
          setFlashVisible(true)
          error && error()
        } else if (data && data.errors) {
          setFlashProps({
            type: 'error',
            message: 'We couldn\'t update your list and we\'re not sure what went wrong. We\'re sorry! Please refresh the page and try again.'
          })
          setFlashVisible(true)
          error && error()
        } // no else because if data is null that's been dealt with
      })
      .catch(err => {
        console.error(`Error updating shopping list ${listId}: `, err.message)

        if (err.name === 'AuthorizationError') {
          return logOutWithGoogle(() => {
            token && removeSessionCookie()
            setShouldRedirectTo(paths.login)
          })
        } else {
          setFlashProps({
            type: 'error',
            message: 'An unknown error prevented your changes from being saved. Please refresh the page and try again.'
          })

          if (!flashVisible) setFlashVisible(true)
          error && error()
        }
      }) 
  }

  const value = {
    shoppingLists,
    shoppingListLoadingState,
    performShoppingListUpdate,
    flashProps,
    flashVisible
  }
  
  useEffect(fetchLists, [])

  return(
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  )
}

ShoppingListProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export { ShoppingListContext, ShoppingListProvider}
