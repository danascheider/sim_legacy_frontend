import React, { useState, useEffect }from 'react'
import { useCookies } from 'react-cookie'
import ShoppingList from '../components/shoppingList/shoppingList'
import DashboardLayout from '../layouts/dashboardLayout'
import { backendBaseUri, sessionCookieName } from '../utils/config'
import colorSchemes from '../utils/colorSchemes'
import styles from './shoppingList.module.css'

const ShoppingListPage = () => {
  const [shoppingLists, setShoppingLists] = useState(null)
  const [apiError, setApiError] = useState(null)

  const [cookies, , ,] = useCookies([sessionCookieName])

  const fetchLists = () => {
    const dataUri = `${backendBaseUri[process.env.NODE_ENV]}/shopping_lists`

    if (!!cookies[sessionCookieName]) {
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
      .then(data => {
        if (!!data) {
          if (data.error) {
            setApiError(data.error)
          } else {
            setShoppingLists(data)
          }
        } else {
          console.warn('Something went wrong')
        }
      })
    }
  }

  useEffect(fetchLists, [])

  return(
    <DashboardLayout>
      <h2 className={styles.title}>Your Shopping Lists</h2>
      <hr className={styles.hr} />
      <div className={styles.shoppingListContainer}>
        {!!shoppingLists ?
          shoppingLists.map(({ title, shopping_list_items }, index) => {
            const colorSchemesIndex = index > colorSchemes.length ? index % colorSchemes.length : index

            return(
              <div className={styles.shoppingList}>
                <ShoppingList key={title} title={title} listItems={shopping_list_items} colorScheme={colorSchemes[colorSchemesIndex]} />
              </div>
            )
          }) :
        <div className={styles.noLists}>You have no shopping lists.</div>}
      </div>
    </DashboardLayout>
  )
}

export default ShoppingListPage
