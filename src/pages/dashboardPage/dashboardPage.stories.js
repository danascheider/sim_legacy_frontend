import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import DashboardPage from './dashboardPage'

const profileData = {
  id: 24,
  uid: 'jane.doe@gmail.com',
  email: 'jane.doe@gmail.com',
  name: 'Jane Doe',
  image_url: null
}

export default { title: 'DashboardPage' }

export const Default = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', profileData }}>
    <DashboardPage />
  </AppProvider>
)

export const Loading = () => (
  <AppProvider overrideValue={{ token: 'xxxxxx', profileLoadState: 'loading' }}>
    <DashboardPage />
  </AppProvider>
)
