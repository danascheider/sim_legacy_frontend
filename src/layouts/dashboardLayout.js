import React from 'react'
import DashboardHeader from '../components/dashboardHeader/dashboardHeader'
import styles from './dashboardLayout.module.css'

const DashboardLayout = ({ title, children }) => {
  return(
    <div className={styles.root}>
      <div className={styles.container}>
        {title ?
        <>
          <h2 className={styles.title}>{title}</h2>
          <hr className={styles.hr} />
        </> :
        null}
        {children}
      </div>
      <DashboardHeader />
    </div>
  )
}

export default DashboardLayout
