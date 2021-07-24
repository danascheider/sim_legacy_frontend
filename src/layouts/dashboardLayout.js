import React from 'react'
import PropTypes from 'prop-types'
import DashboardHeader from '../components/dashboardHeader/dashboardHeader'
import GamesDropdown from '../components/gamesDropdown/gamesDropdown'
import styles from './dashboardLayout.module.css'

const DashboardLayout = ({ title, includeGameSelect = false, children }) => {
  return(
    <div className={styles.root}>
      <div className={styles.container}>
        {title ?
        <div className={styles.headerContainer}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{title}</h2>
            {includeGameSelect && <GamesDropdown />}
          </div>
          <hr className={styles.hr} />
        </div> :
        null}
        {children}
      </div>
      <DashboardHeader />
    </div>
  )
}

DashboardLayout.propTypes = {
  title: PropTypes.string,
  includeGameSelect: PropTypes.bool,
  children: PropTypes.node.isRequired
}

export default DashboardLayout
