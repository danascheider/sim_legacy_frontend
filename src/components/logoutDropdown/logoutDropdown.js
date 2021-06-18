import React from 'react'
import GoogleLogout from 'react-google-login'
import { frontendBaseUri, googleClientId } from '../../utils/config'
import styles from './logoutDropdown.module.css'

const LogoutDropdown = ({successCallback, failureCallback, className}) => (
  <div className={className}>
    <div className={styles.body}>
      <GoogleLogout
        className={styles.button}
        buttonText='Log Out With Google'
        clientId={googleClientId[process.env.NODE_ENV]}
        redirectUri={`${frontendBaseUri[process.env.NODE_ENV]}/`}
        onLogoutSuccess={successCallback}
        onLogoutFailure={failureCallback}
      />
    </div>
  </div>
)

export default LogoutDropdown
