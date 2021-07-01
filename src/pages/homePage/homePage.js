import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authorize } from '../../utils/simApi'
import isStorybook from '../../utils/isStorybook'
import logOutWithGoogle from '../../utils/logOutWithGoogle'
import { useAppContext } from '../../hooks/contexts'
import paths from '../../routing/paths'
import styles from './homePage.module.css'

const HomePage = () => {
  const { token, setShouldRedirectTo, removeSessionCookie } = useAppContext()

  const verifyLogin = () => {
    if (token && !isStorybook()) {
      authorize(token)
        .then((resp) => {
          setShouldRedirectTo(paths.dashboard.main)
        })
        .catch(err => {
          logOutWithGoogle(() => {
            removeSessionCookie()
          })
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
