import React from 'react'
import GoogleLogin from 'react-google-login'
import { Redirect } from 'react-router-dom'
import { googleClientId } from '../utils/config'
import styles from './login.module.css'

const LoginPage = ({ pageProps }) => {
  const { userLoggedIn, loginSuccessCallback, loginFailureCallback } = pageProps

  return(userLoggedIn ?
    <div className={styles.root}>
      <GoogleLogin
        className={styles.button}
        clientId={googleClientId[process.env.NODE_ENV]}
        buttonText='Log In with Google'
        onSuccess={loginSuccessCallback}
        onFailure={loginFailureCallback}
        isSignedIn={true}
      />
    </div>
    : <Redirect to='/logout' />
  )
}

export default LoginPage
