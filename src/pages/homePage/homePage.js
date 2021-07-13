import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { authorize } from '../../utils/simApi'
import isStorybook from '../../utils/isStorybook'
import logOutWithGoogle from '../../utils/logOutWithGoogle'
import { useAppContext } from '../../hooks/contexts'
import paths from '../../routing/paths'
import styles from './homePage.module.css'

const HomePage = () => {
  const { token, setShouldRedirectTo, removeSessionCookie } = useAppContext()

  const mountedRef = useRef(true)

  const verifyLogin = () => {
    if (token && !isStorybook()) {
      authorize(token)
        .then(resp => resp.status === 500 ? resp.json() : null)
        .then(data => {
          if (data) {
            throw new Error('Internal Server Error: ', data.errors[0])
          } else {
            setShouldRedirectTo(paths.dashboard.main)
            mountedRef.current = false
          }
        })
        .catch(err => {
          if (process.env.NODE_ENV !== 'production') console.error(err.message)

          logOutWithGoogle(() => removeSessionCookie())
        })
    }
  }

  useEffect(() => {
    verifyLogin()
    return () => mountedRef.current = false
  }, [token])

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
