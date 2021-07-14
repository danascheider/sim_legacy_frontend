import React, { useEffect, useState, useRef } from 'react'
import GoogleLogin from 'react-google-login'
import {
  googleClientId,
  frontendBaseUri
} from '../../utils/config'
import { useAppContext } from '../../hooks/contexts'
import paths from '../../routing/paths'
import styles from './loginPage.module.css'

const LoginPage = () => {
  const {
    token,
    setSessionCookie,
    removeSessionCookie,
    setShouldRedirectTo
  } = useAppContext()

  const [loginErrorMessage, setLoginErrorMessage] = useState(null)
  const mountedRef = useRef(true)

  const successCallback = (resp) => {
    const { tokenId } = resp

    if (tokenId) {
      setSessionCookie(tokenId)
      setShouldRedirectTo(paths.dashboard.main)
      mountedRef.current = false
    }
  }

  const failureCallback = (resp) => {
    if (process.env.NODE_ENV === 'development') console.error('Login failure: ', resp)
    token && removeSessionCookie()
    setLoginErrorMessage('Something went wrong! Please try logging in again.')
  }

  useEffect(() => (
    () => (mountedRef.current = false)
  ))

  return(
    <div className={styles.root}>
      {loginErrorMessage ?
      <p className={styles.errorMessage}>{loginErrorMessage}</p> :
      null}
      <div className={styles.container}>
        <GoogleLogin
          className={styles.button}
          clientId={googleClientId}
          buttonText='Log In With Google'
          onSuccess={successCallback}
          onFailure={failureCallback}
          redirectUri={`${frontendBaseUri}${paths.dashboard.main}`}
        />
      </div>
    </div>
  )
}

export default LoginPage
