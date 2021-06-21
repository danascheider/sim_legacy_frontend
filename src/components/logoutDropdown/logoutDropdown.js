import React from 'react'
import icon from './googleIcon.svg'
import styles from './logoutDropdown.module.css'

const LogoutDropdown = ({className, logOutUser}) => (
  <div className={className}>
    <button className={styles.button} onClick={logOutUser}>
      <div className={styles.body}>
        <div className={styles.googleLogout}>
          <img src={icon} alt='Google logo' />
          Log Out With Google
        </div>
      </div>
    </button>
  </div>
)

export default LogoutDropdown
