import React from 'react'
import { YELLOW } from '../../utils/colorSchemes'
import { useShoppingListContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import ShoppingListPageContent from '../../components/shoppingListPageContent/shoppingListPageContent'
import Loading from '../../components/loading/loading'
import styles from './shoppingListPage.module.css'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const ShoppingListPage = () => {
  const {
    shoppingLists,
    shoppingListLoadingState,
    flashProps,
    flashVisible
  } = useShoppingListContext()

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {flashVisible && <div className={styles.flash}><FlashMessage {...flashProps} /></div>}
      {shoppingLists && shoppingListLoadingState === DONE && <ShoppingListPageContent lists={shoppingLists} />}
      {shoppingListLoadingState === LOADING && <Loading className={styles.loading} type='bubbles' color={YELLOW.schemeColor} height='15%' width='15%' />}
      {(shoppingListLoadingState === ERROR || (shoppingListLoadingState === DONE && !shoppingLists)) && <p className={styles.error}>There was an error loading your lists. It may have been on our end. We're sorry!</p>}
    </DashboardLayout>
  )
}

export default ShoppingListPage
