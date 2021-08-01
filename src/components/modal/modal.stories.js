import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { token, profileData } from '../../sharedTestData'
import Modal from './modal'

export default { title: 'Modal' }

export const Default = () => (
  <AppProvider overrideValue={{ modalVisible: true, token, profileData }}>
    <Modal title='Modal Content'>
      <p style={{ marginBottom: 0 }}>This is the modal content</p>
    </Modal>
  </AppProvider>
)

export const WithSubtitle = () => (
  <AppProvider overrideValue={{ modalVisible: true, token, profileData }}>
    <Modal title='Modal Content' subtitle='This is a modal with a subtitle'>
      <p style={{ marginBottom: 0 }}>This is the modal content</p>
    </Modal>
  </AppProvider>
)
