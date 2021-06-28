import React from 'react'
import { useShoppingListContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import ShoppingListPageContent from '../../components/shoppingListPageContent/shoppingListPageContent'
import styles from './shoppingListPage.module.css'

const LOADING = 'loading'
const DONE = 'done'
const ERROR = 'error'

const ShoppingListPage = () => {
  const {
    flashProps,
    flashVisible
  } = useShoppingListContext()

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {flashVisible && <div className={styles.flash}><FlashMessage {...flashProps} /></div>}
      <ShoppingListPageContent /> {/* This component implements its own loading behaviour */}
    </DashboardLayout>
  )
}

export default ShoppingListPage
