import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { token, profileData } from '../../sharedTestData'
import InventoryPage from './inventoryPage'

export default { title: 'InventoryPage' }

export const Default = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <InventoryPage />
  </AppProvider>
)
