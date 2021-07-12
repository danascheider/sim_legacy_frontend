import React from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../hooks/contexts'
import paths from '../../routing/paths'
import styles from './notFoundPage.module.css'

const NotFoundPage = () => {
  const { token } = useAppContext()

  return(
    <div className={styles.root}>
      <div className={styles.container}>
        <h1 className={styles.header}>SIM: Page Not Found</h1>
        <Link className={styles.link} to={token ? paths.dashboard.main : paths.home}>Go Back</Link>
      </div>
    </div>
  )
}

export default NotFoundPage
