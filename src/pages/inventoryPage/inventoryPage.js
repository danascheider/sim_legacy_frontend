import React from 'react'
import { useAppContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import InventoryPageContent from '../../components/inventoryPageContent/inventoryPageContent'

const InventoryPage = () => {
  const { modalVisible, modalAttributes } = useAppContext()

  return(
    <DashboardLayout title='Your Inventory' includeGameSelect>
      {modalVisible && <modalAttributes.Tag {...modalAttributes.props} />}
      <FlashMessage />
      <InventoryPageContent />
    </DashboardLayout>
  )
}

export default InventoryPage
