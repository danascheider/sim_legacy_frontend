import React, { useEffect, useRef } from 'react'
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

  const mountedRef = useRef(true)

  useEffect(() => {
    if (mountedRef.current && shoppingListLoadingState === ERROR) setFlashVisible(true)
  }, [shoppingListLoadingState, setFlashVisible])

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <DashboardLayout title='Your Shopping Lists' includeGameSelect>
      {listItemEditFormVisible && 
        <Modal
          title={listItemEditFormProps.currentAttributes.description}
          subtitle={`On list "${listItemEditFormProps.listTitle}"`}
          setVisible={setListItemEditFormVisible}
        >
          <ShoppingListItemEditForm {...listItemEditFormProps} />
        </Modal>
      }
      {flashVisible && <div className={styles.flash}><FlashMessage {...flashProps} /></div>}
      <div className={styles.createForm}><ShoppingListCreateForm disabled={shouldDisableForm} /></div>
      <ShoppingListsPageContent /> {/* This component implements its own loading & error handling behaviour */}
    </DashboardLayout>
  )
}

export default ShoppingListsPage
