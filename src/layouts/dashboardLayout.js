import React from 'react'
import PropTypes from 'prop-types'
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

DashboardLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default DashboardLayout
