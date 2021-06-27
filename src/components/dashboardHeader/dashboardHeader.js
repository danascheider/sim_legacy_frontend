import React, { useState, useEffect, useRef } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { backendBaseUri } from '../../utils/config'
import isStorybook from '../../utils/isStorybook'
import paths from '../../routing/paths'
import { useDashboardContext } from '../../hooks/contexts'
import LogoutDropdown from '../logoutDropdown/logoutDropdown'
import anonymousAvatar from './anonymousAvatar.jpg'
import styles from './dashboardHeader.module.css'

const DashboardHeader = () => {
  const {
    token,
    profileData,
    removeSessionCookie,
    setProfileData
  } = useDashboardContext()

  const initialRedirectPath = !token ? paths.login : null
  const [shouldRedirectTo, setShouldRedirectTo] = useState(initialRedirectPath)

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const mountedRef = useRef(true)

  const fetchprofileData = () => {
    const dataUri = `${backendBaseUri[process.env.NODE_ENV]}/users/current`

    if (mountedRef.current === true && (isStorybook() || !!token)) {
      fetch(dataUri, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => (response.json()))
      // TODO: https://trello.com/c/JRyN8FSN/25-refactor-error-handling-in-promise-chains
      .then(data => {
        if (!data) {
          setShouldRedirectTo(paths.login)
        } else if (data.error) {
          console.warn('Error fetching user data - logging out user: ', data.error)
          removeSessionCookie()
          setShouldRedirectTo(paths.login)
        } else {
          setProfileData(data)
          setShouldRedirectTo(null)
        }
      })
      .catch(() => {
        token && removeSessionCookie()
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
          !!token && removeSessionCookie()
          setShouldRedirectTo(paths.home)
          mountedRef.current = false
        },
        error => {
          console.log('Logout error: ', error)
        })
      }
    } else {
      !!token && removeSessionCookie()
      setShouldRedirectTo(paths.home)
      mountedRef.current = false
    }
  }

  useEffect(fetchprofileData, [])

  return(!!shouldRedirectTo ?
    <Redirect to={shouldRedirectTo} /> :
    <div className={styles.root}>
      <div className={styles.bar}>
        <span className={styles.headerContainer}>
          <h1 className={styles.header}>
            <Link className={styles.headerLink} to={paths.dashboard.main}>Skyrim Inventory<br className={styles.bp} /> Management</Link>
          </h1>
        </span>
        {!!profileData ?
        <button className={styles.profile} onClick={() => setDropdownVisible(!dropdownVisible)}>
          <div className={styles.profileText}>
            <p className={styles.textTop}>{profileData.name}</p>
            <p className={styles.textBottom}>{profileData.email}</p>
          </div>
          <img className={styles.avatar} src={profileData.image_url || anonymousAvatar} alt='User avatar' referrerPolicy='no-referrer' />
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
