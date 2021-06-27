import React, { useState, useEffect }from 'react'
import { fetchShoppingLists, updateShoppingList } from '../../utils/simApi'
import { YELLOW } from '../../utils/colorSchemes'
import isStorybook from '../../utils/isStorybook'
import logOutWithGoogle from '../../utils/logOutWithGoogle'
import paths from '../../routing/paths'
import { useDashboardContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import ShoppingListPageContent from '../../components/shoppingListPageContent/shoppingListPageContent'
import Loading from '../../components/loading/loading'
import styles from './shoppingListPage.module.css'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState(null)
  const [loadingState, setLoadingState] = useState(LOADING)
  const [flashProps, setFlashProps] = useState({})
  const [flashVisible, setFlashVisible] = useState(false)

  const { token, removeSessionCookie, setShouldRedirectTo } = useDashboardContext()

  const fetchLists = () => {
    if (!!token || isStorybook()) {
      fetchShoppingLists(token)
        .then(resp => resp.json())
        .then(data => {
          if (data) {
            setShoppingLists(data)
            setLoadingState(DONE)
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
            setLoadingState(ERROR)
          }
        })
    }
  }

  const updateList = (listId, e) => {
    e.preventDefault()

    const newTitle = e.nativeEvent.target.children[0].defaultValue

    updateShoppingList(token, listId, { title: newTitle })
      .then(response => {
        switch(response.status) {
          case 200:
          case 422:
            return response.json()
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
        } else if (data && data.errors && data.errors.title) {
          setFlashProps({
            type: 'error',
            header: `${data.errors.title.length} error(s) prevented your changes from being saved:`,
            message: data.errors.title.map(msg => `Title ${msg}`)
          })
          setFlashVisible(true)
        } else {
          setFlashProps({
            type: 'error',
            message: 'We couldn\'t update your list and we\'re not sure what went wrong. We\'re sorry! Please refresh the page and try again.'
          })
          setFlashVisible(true)
        }
      })
      .catch(error => {
        console.error(`Error updating shopping list ${listId}: `, error.message)

        // The simApi module functions all throw a custom error class
        // called AuthorizationError (defined in /src/utils/customErrors.js)
        // in the event the API response status is 401
        if (error.name === 'AuthorizationError') {
          return logOutWithGoogle(() => {
            token && removeSessionCookie()
            setShouldRedirectTo(paths.login)
          })
        } else
          setFlashProps({
            type: 'error',
            message: 'An unknown error prevented your changes from being saved. Please refresh the page and try again.'
          })

          if (!flashVisible) setFlashVisible(true)
      })
  }

  useEffect(fetchLists, [])

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {flashVisible && <div className={styles.flash}><FlashMessage {...flashProps} /></div>}
      {shoppingLists && loadingState === DONE && <ShoppingListPageContent lists={shoppingLists} onSubmitEditForm={updateList} />}
      {loadingState === LOADING && <Loading className={styles.loading} type='bubbles' color={YELLOW.schemeColor} height='15%' width='15%' />}
      {loadingState === ERROR && <p className={styles.error}>There was an error loading your lists.</p>}
    </DashboardLayout>
  )
}

export default ShoppingListPage
