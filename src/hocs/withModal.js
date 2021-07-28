import React, { useRef } from 'react'
import Modal from '../components/modal/modal'

const withModal = (WrappedComponent, setModalVisible) => {
  return (props) => {
    const contentRef = useRef(null)

    const contentRefContains = el => contentRef.current && (contentRef.current === el || contentRef.current.contains(el))

    const hideContent = e => {
      if (!contentRefContains(e.target)) setModalVisible(false)
    }

    return(
      <Modal onClick={hideContent}>
        <WrappedComponent ref={contentRef} {...props} />
      </Modal>
    )
  }
}

export default withModal
