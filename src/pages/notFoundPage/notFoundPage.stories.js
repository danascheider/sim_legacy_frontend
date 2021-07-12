import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import NotFoundPage from './notFoundPage'

const profileData = {
  id: 24,
  uid: 'dragonborn@gmail.com',
  email: 'dragonborn@gmail.com',
  name: 'Jane Doe',
  image_url: null
}

export default { title: 'NotFoundPage' }

export const Default = () => (
  <AppProvider overrideValue={{ token: null, profileData }}>
    <NotFoundPage />
  </AppProvider>
)
