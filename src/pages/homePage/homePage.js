import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { sessionCookieName } from '../utils/config'
import paths from '../routing/paths'
import styles from './home.module.css'

const HomePage = () => {
  const [cookies, , ,] = useCookies([sessionCookieName])

  return(!!cookies[sessionCookieName] ?
    <Redirect to={paths.dashboard.main} /> :
    <div className={styles.root}>
      <div className={styles.container}>
        <h1 className={styles.header}>Skyrim Inventory Management</h1>
        <Link className={styles.login} to={paths.login}>Log in with Google</Link>
      </div>
    </div>
  )
}

export default HomePage
