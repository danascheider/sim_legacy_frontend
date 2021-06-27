import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logOutWithGoogle from '../../utils/logOutWithGoogle'
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
    setShouldRedirectTo
  } = useDashboardContext()

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const mountedRef = useRef(true)

  const logOutUser = (e) => {
    e.preventDefault()

    setDropdownVisible(false);

    logOutWithGoogle(() => {
      token && removeSessionCookie()
      setShouldRedirectTo(paths.home)
      mountedRef.current = false
    })
  }

  useEffect(() => {
    return () => (mountedRef.current = false)
  }, [])

  return(
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
