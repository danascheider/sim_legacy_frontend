import React from 'react'
import { Link } from 'react-router-dom'
import paths from '../routing/paths'
import styles from './home.module.css'

const HomePage = () => {
  return(
    <div className={styles.root}>
      <h1 className={styles.header}>Skyrim Inventory Management</h1>
      <Link className={styles.login} to={paths.login}>Log in with Google</Link>
    </div>
  )
}

export default HomePage
