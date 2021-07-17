import React from 'react'
import DashboardLayout from '../../layouts/dashboardLayout'
import styles from './gamesPage.module.css'

const GamesPage = () => {
  return(
    <DashboardLayout title='Your Games'>
      <div className={styles.root}>
        <div className={styles.noGames}>You have no games.</div>
      </div>
    </DashboardLayout>
  )
}

export default GamesPage
