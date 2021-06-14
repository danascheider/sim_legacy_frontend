import React from 'react'
import GoogleLogin from 'react-google-login'
import styles from './login.module.css'

const clientId = process.env.NODE_ENV === 'production'
  ? '891031345873-gf3loovttd7bfvrq4ilqdduvvibb0tub.apps.googleusercontent.com'
  : '891031345873-ir73kc1ru0ncv564iesac94kjaap5nf4.apps.googleusercontent.com'

const LoginPage = () => {
  const logGoogleResponse = resp => console.log(resp)

  return(
    <div className={styles.root}>
      <GoogleLogin
        className={styles.button}
        clientId={clientId}
        buttonText='Log In with Google'
        onSuccess={logGoogleResponse}
        onFailure={logGoogleResponse}
        cookiePolicy='single_host_origin'
      />
    </div>
  )
}

export default LoginPage
