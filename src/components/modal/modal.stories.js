import React from 'react'
import Modal from './modal'

const containerStyles = {
  fontFamily: "'Quattrocento Sans', Arial, Helvetica, sans-serif",
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
  margin: 'auto',
  height: '64px',
  padding: '8px',
  backgroundColor: '#fff',
  textAlign: 'center',
  display: 'grid',
  maxWidth: '80%'
}

const contentStyles = {
  margin: 'auto',
  textAlign: 'center'
}

export default { title: 'Modal' }

export const Default = () => (
  <Modal>
    <div style={containerStyles}>
      <p style={contentStyles}>This is the modal content</p>
    </div>
  </Modal>
)
