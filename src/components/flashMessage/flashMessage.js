import React from 'react'
import PropTypes from 'prop-types'
import styles from './flashMessage.module.css'

const SUCCESS = 'success'
const INFO = 'info'
const ERROR = 'error'
const WARNING = 'warning'

const colors = {
  [SUCCESS]: {
    body: '#e5f2e5',
    border: '#b2d8b2',
    text: '#329932'
  },
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
        {message.map((msg, index) => <li key={`message-${index}`} className={styles.msg}>{msg}</li>)}
      </ul>}
    </div>
  )
}

FlashMessage.propTypes = {
  type: PropTypes.oneOf([SUCCESS, INFO, ERROR, WARNING]),
  header: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.string, PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
}

export default FlashMessage
