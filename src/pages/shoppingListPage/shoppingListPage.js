import React, { useEffect, useRef, useCallback } from 'react'
import { useAppContext, useShoppingListContext } from '../../hooks/contexts'
import { shoppingListLoadingStates } from '../../contexts/shoppingListContext'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import Modal from '../../components/modal/modal'
import ShoppingListCreateForm from '../../components/shoppingListCreateForm/shoppingListCreateForm'
import ShoppingListPageContent from '../../components/shoppingListPageContent/shoppingListPageContent'
import styles from './shoppingListPage.module.css'
import ShoppingListItemEditForm from '../../components/shoppingListItemEditForm/shoppingListItemEditForm'

const { LOADING, ERROR } = shoppingListLoadingStates

const ShoppingListPage = () => {
  const { flashProps, flashVisible } = useAppContext()

  const {
    listItemEditFormVisible,
    setListItemEditFormVisible,
    listItemEditFormProps,
    shoppingListLoadingState
  } = useShoppingListContext()

  const shouldDisableForm = shoppingListLoadingState === LOADING || shoppingListLoadingState === ERROR
  const formRef = useRef(null)

  const formRefContains = el => formRef.current && (formRef.current === el || formRef.current.contains(el))

  const hideForm = useCallback(e => {
    if (e.key === 'Escape' || !formRefContains(e.target)) {
      setListItemEditFormVisible(false)
    }
  }, [setListItemEditFormVisible])

  useEffect(() => {
    window.addEventListener('keyup', hideForm)

    return () => window.removeEventListener('keyup', hideForm)
  }, [hideForm])

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {listItemEditFormVisible && <Modal onClick={hideForm}><ShoppingListItemEditForm elementRef={formRef} {...listItemEditFormProps} /></Modal>}
      {flashVisible && <div className={styles.flash}><FlashMessage {...flashProps} /></div>}
      <div className={styles.createForm}><ShoppingListCreateForm disabled={shouldDisableForm} /></div>
      <ShoppingListPageContent /> {/* This component implements its own loading & error handling behaviour */}
    </DashboardLayout>
  )
}

export default ShoppingListPage
