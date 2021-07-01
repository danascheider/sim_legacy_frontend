import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import DashboardHeader from './dashboardHeader'

const providerValue = {
  token: 'xxxxxxx',
  profileData: {
    id: 24,
    uid: 'jane.doe@gmail.com',
    email: 'jane.doe@gmail.com',
    name: 'Jane Doe',
    image_url: null
  },
  removeSessionCookie: () => {}
}

export default { title: 'DashboardHeader' }

export const Default = () => <AppProvider overrideValue={providerValue}><DashboardHeader /></AppProvider>
