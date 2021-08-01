import React from 'react'
import Modal from '../components/modal/modal'

const withModal = WrappedComponent => {
  return ({ title, subtitle = null, ...childProps }) => (
    <Modal title={title} subtitle={subtitle}>
      <WrappedComponent {...childProps} />
    </Modal>
  )
}

export default withModal
