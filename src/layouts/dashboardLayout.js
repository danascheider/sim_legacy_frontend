import React from 'react'
import DashboardHeader from '../components/dashboardHeader/dashboardHeader'
import styles from './dashboardLayout.module.css'

const DashboardLayout = ({ children }) => {
  return(
    <div className={styles.root}>
      {children}
      <DashboardHeader />
    </div>
  )
}

export default DashboardLayout
