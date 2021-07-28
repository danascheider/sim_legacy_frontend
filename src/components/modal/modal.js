import React from 'react'
import styles from './modal.module.css'

const Modal = ({ children, ...props }) => {

  return(
    <div role='dialog' className={styles.root} {...props}>
      {children}
    </div>
  )
}

export default Modal
