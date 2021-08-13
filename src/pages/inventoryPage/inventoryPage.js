import React from 'react'
import DashboardLayout from '../../layouts/dashboardLayout'
import FlashMessage from '../../components/flashMessage/flashMessage'
import InventoryPageContent from '../../components/inventoryPageContent/inventoryPageContent'

const InventoryPage = () => (
  <DashboardLayout title='Your Inventory' includeGameSelect>
    <FlashMessage />
    <InventoryPageContent />
  </DashboardLayout>
)

export default InventoryPage
