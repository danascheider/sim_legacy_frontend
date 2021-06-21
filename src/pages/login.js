import React from 'react'
import { Redirect } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import { useCookies } from 'react-cookie'
import {
  googleClientId,
  frontendBaseUri,
  backendBaseUri,
  sessionCookieName
} from '../utils/config'
import paths from '../routing/paths'
import styles from './login.module.css'

const LoginPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies([sessionCookieName])

  const successCallback = (resp) => {
    const { tokenId } = resp

    const backendUri = `${backendBaseUri[process.env.NODE_ENV]}/auth/verify_token`

    if (cookies[sessionCookieName] !== tokenId) {
      fetch(backendUri, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenId}`
        }
      })
      .then(response => {
        if (response.status === 204) {
          setCookie(sessionCookieName, tokenId)
        } else {
          !!cookies[sessionCookieName] && removeCookie(sessionCookieName)
        }
      })
      .catch(error => {
        !!cookies[sessionCookieName] && removeCookie(sessionCookieName)
        console.log('Error from /auth/verify_token: ', error)
        return <Redirect to={paths.home} />
      })
    }
  }

  const failureCallback = (resp) => {
    console.log('Login failure: ', resp)
    !!cookies[sessionCookieName] && removeCookie(sessionCookieName)
  }

  return(!!cookies[sessionCookieName] ?
    <Redirect to={paths.dashboard.main} /> :
    <div className={styles.root}>
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

  // return(!!cookies[sessionCookieName] ?
  //   <Redirect to={paths.dashboard} /> :
  //   <div className={styles.root}>
  //     <GoogleLogin
  //       className={styles.button}
  //       clientId={googleClientId[process.env.NODE_ENV]}
  //       buttonText='Log In with Google'
  //       onSuccess={successCallback}
  //       onFailure={failureCallback}
  //       redirectUri={`${frontendBaseUri[process.env.NODE_ENV]}/dashboard`}
  //       isSignedIn={true}
  //     />
  //   </div>
  // )
}

export default LoginPage
