import React, { useRef, useEffect, useCallback } from 'react'
import Modal from '../components/modal/modal'

const withModal = (WrappedComponent, setModalVisible) => {
  return (props) => {
    const mountedRef = useRef(true)
    const contentRef = useRef(null)

    const contentRefContains = useCallback(el => (
      contentRef.current && (contentRef.current === el || contentRef.current.contains(el))
    ), [])

    const hideModal = useCallback(e => {
      // If the Escape key is pressed, or if the user clicks on the modal div
      // outside the content element, the modal should be hidden.
      if ((e.type === 'keydown' && e.key === 'Escape') || (e.type === 'click' && !contentRefContains(e.target))) {
        setModalVisible(false)
        mountedRef.current = false
      }
    }, [contentRefContains])

    useEffect(() => {
      window.addEventListener('keydown', hideModal)

      return () => window.removeEventListener('keydown', hideModal)
    })

    useEffect(() => {
      document.getElementsByTagName('body')[0].classList.add('modal-open')

      return () => document.getElementsByTagName('body')[0].classList.remove('modal-open')
    })

    useEffect(() => (
      () => mountedRef.current = false
    ), [])

    return(
      <Modal onClick={hideModal}>
        <WrappedComponent ref={contentRef} {...props} />
      </Modal>
    )
  }
}

export default withModal
