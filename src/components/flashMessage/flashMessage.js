import React from 'react'
import PropTypes from 'prop-types'
import styles from './flashMessage.module.css'

const INFO = 'info'
const ERROR = 'error'
const WARNING = 'warning'

const colors = {
  [INFO]: {
    body: '#cce5ff',
    border: '#b3d8ff',
    text: '#6289b2',
  },
  [ERROR]: {
    body: '#ffcccc',
    border: '#ff9999',
    text: '#cc0000'
  },
  [WARNING]: {
    body: '#fefde4',
    border: '#fdf797',
    text: '#b0a723'
  }
}

const FlashMessage = ({ type = INFO, header, message }) => {
  const colorVars = {
    '--body-color': colors[type].body,
    '--border-color': colors[type].border,
    '--text-color': colors[type].text
  }

  return(
    <div className={styles.root} style={colorVars}>
      {header && <p className={styles.header}>{header}</p>}
      {typeof message === 'string' ? message :
      <ul className={styles.messageList}>
        {message.map(msg => <li className={styles.msg}>{msg}</li>)}
      </ul>}
    </div>
  )
}

FlashMessage.propTypes = {
  type: PropTypes.oneOf([INFO, ERROR, WARNING]),
  children: PropTypes.node.isRequired,
  header: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.string, PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
}

export default FlashMessage
