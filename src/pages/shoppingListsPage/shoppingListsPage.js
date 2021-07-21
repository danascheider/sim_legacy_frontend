import React, { useEffect, useRef, useCallback } from 'react'
import { useAppContext, useShoppingListsContext } from '../../hooks/contexts'
import { shoppingListLoadingStates } from '../../contexts/shoppingListsContext'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import Modal from '../../components/modal/modal'
import ShoppingListCreateForm from '../../components/shoppingListCreateForm/shoppingListCreateForm'
import ShoppingListsPageContent from '../../components/shoppingListsPageContent/shoppingListsPageContent'
import ShoppingListItemEditForm from '../../components/shoppingListItemEditForm/shoppingListItemEditForm'
import styles from './shoppingListsPage.module.css'

const { LOADING, ERROR } = shoppingListLoadingStates

const ShoppingListsPage = () => {
  const { flashProps, flashVisible, setFlashVisible } = useAppContext()

  const {
    listItemEditFormVisible,
    setListItemEditFormVisible,
    listItemEditFormProps,
    shoppingListLoadingState
  } = useShoppingListsContext()

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

  useEffect(() => {
    if (mountedRef.current && shoppingListLoadingState === ERROR) setFlashVisible(true)
  })

  return(
    <DashboardLayout title='Your Shopping Lists'>
      {listItemEditFormVisible && <Modal onClick={hideForm}><ShoppingListItemEditForm elementRef={formRef} {...listItemEditFormProps} /></Modal>}
      {flashVisible && <div className={styles.flash}><FlashMessage {...flashProps} /></div>}
      <div className={styles.createForm}><ShoppingListCreateForm disabled={shouldDisableForm} /></div>
      <ShoppingListsPageContent /> {/* This component implements its own loading & error handling behaviour */}
    </DashboardLayout>
  )
}

export default ShoppingListsPage
