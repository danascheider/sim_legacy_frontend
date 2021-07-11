import React, { useEffect, useRef } from 'react'
import { useShoppingListContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import ShoppingListCreateForm from '../../components/shoppingListCreateForm/shoppingListCreateForm'
import ShoppingListPageContent from '../../components/shoppingListPageContent/shoppingListPageContent'
import styles from './shoppingListPage.module.css'
import ShoppingListItemEditForm from '../../components/shoppingListItemEditForm/shoppingListItemEditForm'

const ShoppingListPage = () => {
  const {
    flashProps,
    flashVisible,
    listItemEditFormVisible,
    setListItemEditFormVisible,
    listItemEditFormProps,
    shoppingListLoadingState
  } = useShoppingListContext()

  const shouldDisableForm = shoppingListLoadingState === 'loading' || shoppingListLoadingState === 'error'
  const formRef = useRef(null)

  const formRefContains = el => formRef.current && (formRef.current === el || formRef.current.contains(el))

  const hideForm = e => {
    if (e.key === 'Escape' || !formRefContains(e.target)) {
      setListItemEditFormVisible(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', hideForm)

    return () => window.removeEventListener('keyup', hideForm)
  }, [hideForm])

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {listItemEditFormVisible && <div className={styles.overlay} onClick={hideForm}><ShoppingListItemEditForm elementRef={formRef} {...listItemEditFormProps} /></div>}
      {flashVisible && <div className={styles.flash}><FlashMessage {...flashProps} /></div>}
      <div className={styles.createForm}><ShoppingListCreateForm disabled={shouldDisableForm} /></div>
      <ShoppingListPageContent /> {/* This component implements its own loading & error handling behaviour */}
    </DashboardLayout>
  )
}

export default ShoppingListPage
