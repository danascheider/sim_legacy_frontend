import React from 'react'
import anonymousAvatar from './anonymousAvatar.jpg'
import styles from './dashboardHeader.module.css'

const DashboardHeader = ({ data, onClick }) => {
  const { email, name, image_url } = data

  return(
    <div className={styles.root}>
      <span className={styles.headerContainer}>
        <h1 className={styles.header}>Skyrim Inventory Management</h1>
      </span>
      <button className={styles.profile} onClick={onClick}>
        <div className={styles.profileText}>
          <p className={styles.textTop}>{name}</p>
          <p className={styles.textBottom}>{email}</p>
        </div>
        <img className={styles.avatar} src={image_url || anonymousAvatar} alt='User avatar' referrerPolicy='no-referrer' />
      </button>
    </div>
  )
}

export default DashboardHeader
