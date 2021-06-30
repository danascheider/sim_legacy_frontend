import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import { useCookies } from 'react-cookie'
import {
  googleClientId,
  frontendBaseUri,
  sessionCookieName
} from '../../utils/config'
import { authorize } from '../../utils/simApi'
import isStorybook from '../../utils/isStorybook'
import paths from '../../routing/paths'
import styles from './loginPage.module.css'
import logOutWithGoogle from '../../utils/logOutWithGoogle'

const LoginPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies([sessionCookieName])
  const [loginErrorMessage, setLoginErrorMessage] = useState(null)

  const successCallback = (resp) => {
    const { tokenId } = resp

    if (cookies[sessionCookieName] !== tokenId) {
      authorize(tokenId)
      .then(response => {
        if (response.status === 204) {
          setCookie(sessionCookieName, tokenId)
        }
      })
      .catch(error => {
        console.error('Error from /auth/verify_token: ', error.message)

        logOutWithGoogle(() => {
          cookies[sessionCookieName] && removeCookie(sessionCookieName)
          return <Redirect to={paths.home} />
        })
      })
    }
  }

  const failureCallback = (resp) => {
    console.error('Login failure: ', resp)
    cookies[sessionCookieName] && removeCookie(sessionCookieName)
    setLoginErrorMessage('Something went wrong! Please try logging in again.')
  }

  return(cookies[sessionCookieName] && !isStorybook() ?
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
          isSignedIn={true}
          redirectUri={`${frontendBaseUri[process.env.NODE_ENV]}${paths.dashboard.main}`}
        />
      </div>
    </div>
  )
}

export default LoginPage
