import React, { useState, useEffect }from 'react'
import { useCookies } from 'react-cookie'
import { backendBaseUri, sessionCookieName } from '../../utils/config'
import colorSchemes, { YELLOW } from '../../utils/colorSchemes'
import isStorybook from '../../utils/isStorybook'
import DashboardLayout from '../../layouts/dashboardLayout'
import ShoppingList from '../../components/shoppingList/shoppingList'
import Loading from '../../components/loading/loading'
import styles from './shoppingListPage.module.css'

const LOADING = 'loading'
const LOADED = 'loaded'
const ERROR = 'error'

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState(null)
  const [loadingState, setLoadingState] = useState(LOADING)
  const [apiError, setApiError] = useState(null)

  const [cookies, , ,] = useCookies([sessionCookieName])

  const fetchLists = () => {
    const dataUri = `${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`

    if (!!cookies[sessionCookieName] || isStorybook()) {
      fetch(dataUri, {
        headers: {
          'Authorization': `Bearer ${cookies[sessionCookieName]}`
        }
      })
      .then(response => {
        if (response.status === 200 || response.status === 401) {
          return response.json()
        } else {
          return null
        }
      })
      // TODO: https://trello.com/c/JRyN8FSN/25-refactor-error-handling-in-promise-chains
      .then(data => {
        if (!!data) {
          if (data.error) {
            setLoadingState(ERROR)
            setApiError(data.error)
          } else {
            setLoadingState(LOADED)
            setShoppingLists(data)
          }
        } else {
          setLoadingState(ERROR)
          setApiError('Unknown error: something went wrong when retrieving your shopping list data.')
          console.warn('Something went wrong')
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
        'Authorization': `Bearer ${cookies[sessionCookieName]}`
      },
      body: JSON.stringify({
        id: listId,
        shopping_list: {
          title: newTitle
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      // TODO: https://trello.com/c/JRyN8FSN/25-refactor-error-handling-in-promise-chains
      if (data.error && data.error.match(/not found/i)) {
        alert('Oops! There was an issue updating your shopping list. Try refreshing the page to resolve this issue.')
      } else {
        const newShoppingLists = shoppingLists.map((list, i) => { if (list.id === listId) { return data } else { return list } })
        console.log('new shopping lists: ', newShoppingLists)
        setShoppingLists(newShoppingLists)
      }
    })
    .catch(error => console.error(error))
  }

  useEffect(fetchLists, [])

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {!!shoppingLists ?
        (shoppingLists.length > 0 ? shoppingLists.map(({ id, master, title, shopping_list_items }, index) => {
          // If there are more lists than colour schemes, cycle through the colour schemes
          const colorSchemesIndex = index > colorSchemes.length ? (index % colorSchemes.length) : index
          const listKey = title.toLowerCase().replace(' ', '-')

          return(
            <div className={styles.shoppingList} key={listKey}>
              <ShoppingList
                canEdit={!master}
                title={title}
                listItems={shopping_list_items}
                colorScheme={colorSchemes[colorSchemesIndex]}
                onSubmitEditForm={(e) => updateList(id, e)}
              />
            </div>
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
