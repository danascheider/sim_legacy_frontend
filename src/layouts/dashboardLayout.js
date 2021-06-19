import React from 'react'
import ReactLoading from 'react-loading'
import DashboardHeader from '../components/dashboardHeader/dashboardHeader'
import styles from './dashboardLayout.module.css'

const DashboardLayout = ({ userData, children }) => (
  <div className={styles.root}>
    {children}
    {!!userData ? <DashboardHeader data={userData} /> : <ReactLoading type='spinningBubbles' color='#ccc' />}
  </div>
)

export default DashboardLayout
