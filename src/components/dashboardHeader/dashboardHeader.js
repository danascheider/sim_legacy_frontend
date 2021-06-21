import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import paths from '../../routing/paths'
import { sessionCookieName, backendBaseUri } from '../../utils/config'
import LogoutDropdown from '../logoutDropdown/logoutDropdown'
import anonymousAvatar from './anonymousAvatar.jpg'
import styles from './dashboardHeader.module.css'

const DashboardHeader = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [cookies, , removeCookie] = useCookies([sessionCookieName])
  const [userData, setUserData] = useState(null)
  const [shouldRedirect, setShouldRedirect] = useState(!cookies[sessionCookieName])

  const fetchUserData = () => {
    const dataUri = `${backendBaseUri[process.env.NODE_ENV]}/users/current`

    if (!!cookies[sessionCookieName]) {
      fetch(dataUri, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies[sessionCookieName]}`
        }
      })
      .then(response => {
        if (response.status === 401) {
          return null
        } else {
          return response.json()
        }
      })
      .then(data => {
        if (!!data) {
          setUserData(data)
          setShouldRedirect(false)
        } else {
          removeCookie(sessionCookieName)
          setShouldRedirect(true)
        }
      })
      .catch(() => {
        cookies[sessionCookieName] && removeCookie(sessionCookieName)
        setShouldRedirect(true)
      })
    } else {
      setShouldRedirect(true)
    }
  }

  useEffect(fetchUserData, [cookies, removeCookie])

  return(!!shouldRedirect ?
    <Redirect to={paths.login} /> :
    <div className={styles.root}>
      <div className={styles.bar}>
        <span className={styles.headerContainer}>
          <h1 className={styles.header}>
            Skyrim Inventory<br className={styles.bp} /> Management
          </h1>
        </span>
        {!!userData ?
        <button className={styles.profile} onClick={() => setDropdownVisible(!dropdownVisible)}>
          <div className={styles.profileText}>
            <p className={styles.textTop}>{userData.name}</p>
            <p className={styles.textBottom}>{userData.email}</p>
          </div>
          <img className={styles.avatar} src={userData.image_url || anonymousAvatar} alt='User avatar' referrerPolicy='no-referrer' />
        </button> :
        null
        }
        <LogoutDropdown
          className={dropdownVisible ? styles.logoutDropdown : styles.hidden}
        />
      </div>
    </div>
  )
}

export default DashboardHeader
