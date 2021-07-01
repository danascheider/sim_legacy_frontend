import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authorize } from '../../utils/simApi'
import isStorybook from '../../utils/isStorybook'
import { useAppContext } from '../../hooks/contexts'
import paths from '../../routing/paths'
import styles from './homePage.module.css'

const HomePage = () => {
  const { token, setShouldRedirectTo, removeSessionCookie } = useAppContext()

  const verifyLogin = () => {
    if (token && !isStorybook()) {
      authorize(token)
        .then((resp) => {
          if (resp.status === 401) {
            removeSessionCookie() // it's expired
            return null
          } else {
            setShouldRedirectTo(paths.dashboard.main)
          }
        })
    }
  }

  useEffect(verifyLogin, [])

  return(
    <div className={styles.root}>
      <div className={styles.container}>
        <h1 className={styles.header}>Skyrim Inventory Management</h1>
        <Link className={styles.login} to={paths.login}>Log in with Google</Link>
      </div>
    </div>
  )
}

export default HomePage
