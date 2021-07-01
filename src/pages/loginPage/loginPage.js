import React, { useEffect, useState, useRef } from 'react'
import GoogleLogin from 'react-google-login'
import {
  googleClientId,
  frontendBaseUri
} from '../../utils/config'
import { authorize } from '../../utils/simApi'
import isStorybook from '../../utils/isStorybook'
import { useAppContext } from '../../hooks/contexts'
import paths from '../../routing/paths'
import styles from './loginPage.module.css'
import logOutWithGoogle from '../../utils/logOutWithGoogle'

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

    if (token !== tokenId) {
      authorize(tokenId)
        .then(response => {
          if (response.status === 204) {
            setSessionCookie(tokenId)
            if (!isStorybook()) {
              setShouldRedirectTo(paths.dashboard.main)
              mountedRef.current = false
            }
          }
        })
        .catch(error => {
          console.error('Error from /auth/verify_token: ', error.message)

          logOutWithGoogle(() => {
            token && removeSessionCookie()
          })
        })
    }
  }

  const failureCallback = (resp) => {
    console.error('Login failure: ', resp)
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
          clientId={googleClientId[process.env.NODE_ENV]}
          buttonText='Log In With Google'
          onSuccess={successCallback}
          onFailure={failureCallback}
          isSignedIn={true}
          redirectUri={`${frontendBaseUri[process.env.NODE_ENV]}${paths.dashboard.main}`}
        />
      </div>
    </div>
  )
}

export default LoginPage
