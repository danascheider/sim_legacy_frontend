import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useAppContext } from '../../hooks/contexts'
import styles from './flashMessage.module.css'

const SUCCESS = 'success'
const INFO = 'info'
const ERROR = 'error'
const WARNING = 'warning'

const colors = {
  [SUCCESS]: '#329932',
  [INFO]: '#4e6d8e',
  [ERROR]: '#cc0000',
  [WARNING]: '#b0a723'
}

const FlashMessage = () => {
  const { flashVisible, setFlashVisible, flashAttributes } = useAppContext()

  const { type, header, message } = flashAttributes

  const colorVars = { '--text-color': colors[type] }

  useEffect(() => {
    if (flashVisible) {
      setTimeout(() => {
        setFlashVisible(false)
      }, 4000)
    }
  }, [flashVisible, setFlashVisible])

  return(
    <div className={classNames(styles.root, { [styles.hidden]: !flashVisible })} style={colorVars}>
      {header && <p className={styles.header}>{header}</p>}
      {typeof message === 'string' ? message :
      <ul className={styles.messageList}>
        {message.map((msg, index) => <li key={`message-${index}`} className={styles.msg}>{msg}</li>)}
      </ul>}
    </div>
  )
}

export default FlashMessage
