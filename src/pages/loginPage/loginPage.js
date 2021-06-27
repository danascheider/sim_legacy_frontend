import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import {
  googleClientId,
  frontendBaseUri,
  backendBaseUri,
} from '../../utils/config'
import isStorybook from '../../utils/isStorybook'
import paths from '../../routing/paths'
import { useDashboardContext } from '../../hooks/contexts'
import styles from './loginPage.module.css'

const LoginPage = () => {
  const {
    token,
    setSessionCookie,
    removeSessionCookie,
  } = useDashboardContext()

  const [loginErrorMessage, setLoginErrorMessage] = useState(null)

  const successCallback = (resp) => {
    const { tokenId } = resp

    const backendUri = `${backendBaseUri[process.env.NODE_ENV]}/auth/verify_token`

    if (token !== tokenId) {
      fetch(backendUri, {
        headers: {
          'Authorization': `Bearer ${tokenId}`
        }
      })
      .then(response => {
        if (response.status === 204) {
          setSessionCookie(tokenId)
        } else { // the status is 401
          !!token && removeSessionCookie()
          throw new Error('SIM API failed to validate Google OAuth token')
        }
      })
      .catch(error => {
        !!token && removeSessionCookie()
        console.error('Error from /auth/verify_token: ', error)
        return <Redirect to={paths.home} />
      })
    }
  }

  const failureCallback = (resp) => {
    console.log('Login failure: ', resp)
    !!token && removeSessionCookie()
    setLoginErrorMessage('Something went wrong! Please try logging in again.')
  }

  return(!!token && !isStorybook() ?
    <Redirect to={paths.dashboard.main} /> :
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
          redirectUri={`${frontendBaseUri[process.env.NODE_ENV]}${paths.dashboard.main}`}
        />
      </div>
    </div>
  )
}

export default LoginPage
