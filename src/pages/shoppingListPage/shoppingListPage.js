import React from 'react'
import { useShoppingListContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import ShoppingListCreateForm from '../../components/shoppingListCreateForm/shoppingListCreateForm'
import ShoppingListPageContent from '../../components/shoppingListPageContent/shoppingListPageContent'
import styles from './shoppingListPage.module.css'

const ShoppingListPage = () => {
  const {
    flashProps,
    flashVisible,
    shoppingListLoadingState
  } = useShoppingListContext()

  const shouldDisableForm = shoppingListLoadingState === 'loading' || shoppingListLoadingState === 'error'

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {flashVisible && <div className={styles.flash}><FlashMessage {...flashProps} /></div>}
      <div className={styles.createForm}><ShoppingListCreateForm disabled={shouldDisableForm} /></div>
      <ShoppingListPageContent /> {/* This component implements its own loading & error handling behaviour */}
    </DashboardLayout>
  )
}

export default ShoppingListPage
