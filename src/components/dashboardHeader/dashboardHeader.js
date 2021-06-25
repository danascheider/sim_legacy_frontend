import React, { useState, useEffect, useRef } from 'react'
import { useCookies } from 'react-cookie'
import { Link, Redirect } from 'react-router-dom'
import paths from '../../routing/paths'
import { sessionCookieName, backendBaseUri } from '../../utils/config'
import isStorybook from '../../utils/isStorybook'
import LogoutDropdown from '../logoutDropdown/logoutDropdown'
import anonymousAvatar from './anonymousAvatar.jpg'
import styles from './dashboardHeader.module.css'

const DashboardHeader = () => {
  const [cookies, , removeCookie] = useCookies([sessionCookieName])

  const initialRedirectPath = !cookies[sessionCookieName] ? paths.login : null
  const [shouldRedirectTo, setShouldRedirectTo] = useState(initialRedirectPath)

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [userData, setUserData] = useState(null)
  const mountedRef = useRef(true)

  const fetchUserData = () => {
    const dataUri = `${backendBaseUri[process.env.NODE_ENV]}/users/current`

    if (mountedRef.current === true && (isStorybook() || !!cookies[sessionCookieName])) {
      fetch(dataUri, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies[sessionCookieName]}`
        }
      })
      .then(response => (response.json()))
      // TODO: https://trello.com/c/JRyN8FSN/25-refactor-error-handling-in-promise-chains
      .then(data => {
        if (!data) {
          setShouldRedirectTo(paths.login)
        } else if (data.error) {
          console.warn('Error fetching user data - logging out user: ', data.error)
          removeCookie(sessionCookieName)
          setShouldRedirectTo(paths.login)
        } else {
          setUserData(data)
          setShouldRedirectTo(null)
        }
      })
      .catch(() => {
        cookies[sessionCookieName] && removeCookie(sessionCookieName)
        setShouldRedirectTo(paths.login)
      })
    } else {
      setShouldRedirectTo(paths.login)
    }
  }

  const logOutUser = (e) => {
    e.preventDefault()

    setDropdownVisible(false);
    
    if (window.gapi) {
      const auth = window.gapi.auth2.getAuthInstance()

      if (auth != null) {
        auth.then(() => {
          auth.disconnect()
          mountedRef.current = false
          !!cookies[sessionCookieName] && removeCookie(sessionCookieName)
          setShouldRedirectTo(paths.home)
        },
        error => {
          console.log('Logout error: ', error)
        })
      }
    } else {
      mountedRef.current = false
      !!cookies[sessionCookieName] && removeCookie(sessionCookieName)
      setShouldRedirectTo(paths.home)
    }
  }

  useEffect(fetchUserData, [removeCookie])

  return(!!shouldRedirectTo ?
    <Redirect to={shouldRedirectTo} /> :
    <div className={styles.root}>
      <div className={styles.bar}>
        <span className={styles.headerContainer}>
          <h1 className={styles.header}>
            <Link className={styles.headerLink} to={paths.dashboard.main}>Skyrim Inventory<br className={styles.bp} /> Management</Link>
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
          logOutUser={logOutUser}
        />
      </div>
    </div>
  )
}

export default DashboardHeader
