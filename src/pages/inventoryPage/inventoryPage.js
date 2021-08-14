import React from 'react'
import { useAppContext, useInventoryListsContext } from '../../hooks/contexts'
import { LOADING, ERROR } from '../../utils/loadingStates'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import InventoryListCreateForm from '../../components/inventoryListCreateForm/inventoryListCreateForm'
import InventoryPageContent from '../../components/inventoryPageContent/inventoryPageContent'
import styles from './inventoryPage.module.css'

const InventoryPage = () => {
  const { modalVisible, modalAttributes } = useAppContext()
  const { inventoryListLoadingState } = useInventoryListsContext()

  const shouldDisableForm = inventoryListLoadingState === LOADING || inventoryListLoadingState === ERROR

  return(
    <DashboardLayout title='Your Inventory' includeGameSelect>
      {modalVisible && <modalAttributes.Tag {...modalAttributes.props} />}
      <FlashMessage />
      <div className={styles.createForm}><InventoryListCreateForm disabled={shouldDisableForm} /></div>
      <InventoryPageContent />
    </DashboardLayout>
  )
}

export default InventoryPage
