import React from 'react'
import Modal from './modal'

export default { title: 'Modal' }

export const Default = () => (
  <Modal title='Modal Content'>
    <p style={{ marginBottom: 0 }}>This is the modal content</p>
  </Modal>
)
