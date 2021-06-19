import React, { useState } from 'react'
import LogoutDropdown from '../logoutDropdown/logoutDropdown'
import anonymousAvatar from './anonymousAvatar.jpg'
import styles from './dashboardHeader.module.css'

const DashboardHeader = ({ data }) => {
  const { email, name, image_url } = data

  const [dropdownVisible, setDropdownVisible] = useState(false)

  return(
    <div className={styles.root}>
      <div className={styles.bar}>
        <span className={styles.headerContainer}>
          <h1 className={styles.header}>
            Skyrim Inventory<br className={styles.bp} /> Management
          </h1>
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
          />
      </div>
    </div>
  )
}

export default DashboardHeader
