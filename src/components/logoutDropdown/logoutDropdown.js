import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import icon from './googleIcon.svg'
import styles from './logoutDropdown.module.css'

const LogoutDropdown = ({className, logOutFunction}) => {
  const mountedRef = useRef(true)

  const logOutAndUnmount = e => {
    e.preventDefault()

    logOutFunction(() => { mountedRef.current = false })
  }

  useEffect(() => (
    () => mountedRef.current = false
  ))

  return(
    <div className={className}>
      <button className={styles.button} onClick={logOutAndUnmount}>
        <div className={styles.body}>
          <div className={styles.googleLogout}>
            <img src={icon} alt='Google logo' />
            Log Out With Google
          </div>
        </div>
      </button>
    </div>
  )
}

LogoutDropdown.propTypes = {
  className: PropTypes.string,
  logOutFunction: PropTypes.func.isRequired
}

export default LogoutDropdown
