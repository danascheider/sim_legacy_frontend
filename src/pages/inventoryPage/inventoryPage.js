import React from 'react'
import DashboardLayout from '../../layouts/dashboardLayout'
import InventoryPageContent from '../../components/inventoryPageContent/inventoryPageContent'

const InventoryPage = () => (
  <DashboardLayout title='Your Inventory' includeGameSelect>
    <InventoryPageContent />
  </DashboardLayout>
)

export default InventoryPage
