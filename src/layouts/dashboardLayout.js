import React from 'react'
import DashboardHeader from '../components/dashboardHeader/dashboardHeader'
import styles from './dashboardLayout.module.css'

const DashboardLayout = ({ title, children }) => {
  return(
    <div className={styles.root}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <hr className={styles.hr} />
        {children}
      </div>
      <DashboardHeader />
    </div>
  )
}

export default DashboardLayout
