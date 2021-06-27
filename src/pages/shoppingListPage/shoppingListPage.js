import React, { useState, useEffect }from 'react'
import { Redirect } from 'react-router-dom'
import { backendBaseUri } from '../../utils/config'
import colorSchemes, { YELLOW } from '../../utils/colorSchemes'
import isStorybook from '../../utils/isStorybook'
import { useDashboardContext } from '../../hooks/contexts'
import { ColorProvider } from '../../contexts/colorContext'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import ShoppingList from '../../components/shoppingList/shoppingList'
import Loading from '../../components/loading/loading'
import styles from './shoppingListPage.module.css'
import paths from '../../routing/paths'

const LOADING = 'loading'
const LOADED = 'loaded'
const ERROR = 'error'

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState(null)
  const [loadingState, setLoadingState] = useState(LOADING)
  const [apiError, setApiError] = useState(null)
  const [flashProps, setFlashProps] = useState({})
  const [flashVisible, setFlashVisible] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const { token, removeSessionToken } = useDashboardContext()

  const fetchLists = () => {
    const dataUri = `${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`

    if (!!token || isStorybook()) {
      fetch(dataUri, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.status === 401) {
          console.error('SIM API failed to validate Google OAuth token')
          token && removeSessionToken()
          setShouldRedirect(true)
        } else if (response.status === 200) {
          return response.json()
        } else {
          return null
        }
      })
      // TODO: https://trello.com/c/JRyN8FSN/25-refactor-error-handling-in-promise-chains
      .then(data => {
        if (data) {
          setLoadingState(LOADED)
          setShoppingLists(data)
        } else {
          setLoadingState(ERROR)
          setApiError('Something went wrong when retrieving your shopping list data. This is probably a problem on our end - we\'re sorry!')
          console.error('Something went wrong while retrieving shopping list data.')
        }
      })
    }
  }

  const updateList = (listId, e) => {
    e.preventDefault()

    const newTitle = e.nativeEvent.target.children[0].defaultValue

    fetch(`${backendBaseUri[process.env.NODE_ENV]}/shopping_lists/${listId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: listId,
        shopping_list: {
          title: newTitle
        }
      })
    })
    .then(response => {
      switch(response.status) {
        case 200:
        case 422:
          return response.json()
          break;
        case 404:
          setFlashProps({
            type: 'error',
            message: 'Shopping list could not be updated. Try refreshing to fix this problem.'
          })

          setFlashVisible(true)

          return null
          
          break;
        case 401:
          removeSessionToken()
          setShouldRedirect(true)
          break;
        default:
          throw Error(`Something went wrong while updating list ${listId}`)
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
      } else {
        setFlashProps({
          type: 'error',
          message: 'We couldn\'t update your list and we\'re not sure what went wrong. We\'re sorry! Please refresh the page and try again.'
        })
      }

      setFlashVisible(true)

      return null
    })
    .catch(error => {
      console.error(error.message)

      if (!flashVisible) {
        setFlashProps({
          type: 'error',
          message: 'An unknown error prevented your changes from being saved. Please refresh the page and try again.'
        })

        setFlashVisible(true)
      }
    })
  }

  useEffect(fetchLists, [])

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {shouldRedirect && <Redirect to={paths.login} />}
      {flashVisible ? 
        <div className={styles.flash}>
          <FlashMessage {...flashProps} />
        </div> : null}
      {!!shoppingLists ?
        (shoppingLists.length > 0 ? shoppingLists.map(({ id, master, title, shopping_list_items }, index) => {
          // If there are more lists than colour schemes, cycle through the colour schemes
          const colorSchemesIndex = index > colorSchemes.length ? (index % colorSchemes.length) : index
          const listKey = title.toLowerCase().replace(' ', '-')

          return(
            <ColorProvider key={listKey} colorScheme={colorSchemes[colorSchemesIndex]}>
              <div className={styles.shoppingList}>
                  <ShoppingList
                    canEdit={!master}
                    title={title}
                    listItems={shopping_list_items}
                    colorScheme={colorSchemes[colorSchemesIndex]}
                    onSubmitEditForm={(e) => updateList(id, e)}
                  />
              </div>
            </ColorProvider>
          )
        }) : <p className={styles.noLists}>You have no shopping lists.</p>) :
        loadingState === LOADING ?
          <Loading className={styles.loading} type='bubbles' color={YELLOW.schemeColor} height='15%' width='15%' /> :
          loadingState === ERROR ?
            <div className={styles.error}>{apiError}</div> :
            <></>}
    </DashboardLayout>
  )
}

export default ShoppingListPage
