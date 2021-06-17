import React from 'react'
import { Redirect } from 'react-router-dom'
import GoogleLogout from 'react-google-login'
import { useCookies } from 'react-cookie'
import paths from '../routing/paths'
import { frontendBaseUri, googleClientId, sessionCookieName } from '../utils/config'
import styles from './logout.module.css'

const LogoutPage = () => {
  const [cookies, _, removeCookie] = useCookies([sessionCookieName])

  const successCallback = () => {
    console.log('Logout succeeded')
    removeCookie(sessionCookieName)
  }

  const failureCallback = (resp) => {
    console.log('Unable to log out: ', resp)
  }

  return(!!cookies[sessionCookieName] ?
    <div className={styles.root}>
      <GoogleLogout
        className={styles.button}
        buttonText='Log Out'
        clientId={googleClientId[process.env.NODE_ENV]}
        redirectUri={`${frontendBaseUri[process.env.NODE_ENV]}/`}
        isSignedIn={false}
        onLogoutSuccess={successCallback}
        onFailure={failureCallback}
      />
    </div> :
    <Redirect to={paths.login} />
  )
}

export default LogoutPage
