import React, { useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styles from './modal.module.css'

const Modal = ({ children, title, subtitle, setModalVisible }) => {
  const contentRef = useRef(null)
  const mountedRef = useRef(true)

  const contentRefContains = useCallback(el => (
    contentRef.current && (contentRef.current === el || contentRef.current.contains(el))
  ), [])

  const hideModal = useCallback(e => {
    if ((e.type === 'click' && !contentRefContains(e.target)) || (e.type === 'keydown' && e.key === 'Escape')) {
      setModalVisible(false)
      mountedRef.current = false
    }
  }, [contentRefContains, setModalVisible])

  useEffect(() => {
    window.addEventListener('keydown', hideModal)

    return () => {
      window.removeEventListener('keydown', hideModal)
      document.getElementsByTagName('body')[0].classList.remove('modal-open')
    }
  }, [hideModal])

  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('modal-open')

    return () => {
      document.getElementsByTagName('body')[0].classList.remove('modal-open')
      mountedRef.current = false
    }
  }, [])

  return(
    <div role='dialog' className={styles.root} onClick={hideModal}>
      <div ref={contentRef} className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  setModalVisible: PropTypes.func.isRequired
}

export default Modal
