import React from 'react'
import { DashboardProvider } from '../../contexts/dashboardContext'
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
  <DashboardProvider overrideValue={{ token: 'xxxxxx', profileData }}>
    <DashboardPage />
  </DashboardProvider>
)
