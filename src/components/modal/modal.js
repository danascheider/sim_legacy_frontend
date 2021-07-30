import React, { useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useAppContext } from '../../hooks/contexts'
import styles from './modal.module.css'

const Modal = ({ children, title, subtitle, setVisible }) => {
  const { setModalVisible } = useAppContext()

  const contentRef = useRef(null)
  const mountedRef = useRef(true)

  const contentRefContains = useCallback(el => (
    contentRef.current && (contentRef.current === el || contentRef.current.contains(el))
  ), [])

  const hide = useCallback(e => {
    if ((e.type === 'click' && !contentRefContains(e.target)) || (e.type === 'keydown' && e.key === 'Escape')) {
      setVisible && setVisible(false) || setModalVisible(false)
      mountedRef.current = false
    }
  }, [contentRefContains, setVisible, setModalVisible])

  useEffect(() => {
    window.addEventListener('keydown', hide)

    return () => {
      window.removeEventListener('keydown', hide)
      document.getElementsByTagName('body')[0].classList.remove('modal-open')
    }
  }, [hide])

  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('modal-open')

    return () => {
      document.getElementsByTagName('body')[0].classList.remove('modal-open')
      mountedRef.current = false
    }
  }, [])

  return(
    <div role='dialog' className={styles.root} onClick={() => setModalVisible(false)}>
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
  subtitle: PropTypes.string,
  setVisible: PropTypes.func
}

export default Modal
