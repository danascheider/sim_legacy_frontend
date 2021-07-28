import React from 'react'
import Modal from '../components/modal/modal'

const withModal = (WrappedComponent, setModalVisible) => {
  return ({ modalTitle, modalSubtitle = null, ...props }) => {
    const modalProps = { title: modalTitle, subtitle: modalSubtitle, setModalVisible}

    return(
      <Modal {...modalProps}>
        <WrappedComponent {...props} />
      </Modal>
    )
  }
}

export default withModal
