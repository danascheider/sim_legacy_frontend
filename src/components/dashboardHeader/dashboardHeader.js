import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { sessionCookieName } from '../../utils/config'
import LogoutDropdown from '../logoutDropdown/logoutDropdown'
import anonymousAvatar from './anonymousAvatar.jpg'
import styles from './dashboardHeader.module.css'
import paths from '../../routing/paths'

const DashboardHeader = ({ data }) => {
  const { email, name, image_url } = data

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [, , removeCookie] = useCookies([sessionCookieName])

  const logoutSuccess = () => {
    removeCookie(sessionCookieName)
    return <Redirect to={paths.home} />
  }
  const logoutFailure = () => console.log('Failed to log out')

  return(
    <div className={styles.root}>
      <div className={styles.bar}>
        <span className={styles.headerContainer}>
          <h1 className={styles.header}>Skyrim Inventory Management</h1>
        </span>
        <button className={styles.profile} onClick={() => setDropdownVisible(!dropdownVisible)}>
          <div className={styles.profileText}>
            <p className={styles.textTop}>{name}</p>
            <p className={styles.textBottom}>{email}</p>
          </div>
          <img className={styles.avatar} src={image_url || anonymousAvatar} alt='User avatar' referrerPolicy='no-referrer' />
        </button>
        <LogoutDropdown
          className={dropdownVisible ? styles.logoutDropdown : styles.hidden}
          successCallback={logoutSuccess}
          failureCallback={logoutFailure}
        />
      </div>
    </div>
  )
}

export default DashboardHeader
