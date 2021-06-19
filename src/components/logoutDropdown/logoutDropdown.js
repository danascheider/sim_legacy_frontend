import React from 'react'
import { Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import paths from '../../routing/paths'
import { sessionCookieName } from '../../utils/config'
import icon from './googleIcon.svg'
import styles from './logoutDropdown.module.css'

const LogoutDropdown = ({className}) => {
  const [cookies, , removeCookie] = useCookies([sessionCookieName])

  const logOutUser = () => {
    const googleUri = 'https://accounts.google.com/o/oauth2/revoke?token=' + cookies[sessionCookieName]
    
    fetch(googleUri, {
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
     }
    }).then((resp) => {
      console.log('Revoked token through Google: ', resp)
      removeCookie(sessionCookieName)
      return <Redirect to={paths.home} />
    })
  }

  return(
    <button className={className} onClick={logOutUser}>
      <div className={styles.body}>
        <div className={styles.googleLogout}>
          <img src={icon} alt='Google logo' />
          Log Out With Google
        </div>
      </div>
    </button>
  )
}

export default LogoutDropdown
