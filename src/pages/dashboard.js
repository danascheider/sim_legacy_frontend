import React from 'react'
import paths from '../routing/paths'
import DashboardLayout from '../layouts/dashboardLayout'
import NavigationMosaic from '../components/navigationMosaic/navigationMosaic'
import styles from './dashboard.module.css'

const cards = [
  {
    backgroundColor: '#FFBF00',
    textColor: '#000000',
    href: paths.shoppingLists,
    children: 'Your Shopping Lists',
    key: 'shopping-lists'
  },
  {
    backgroundColor: '#E83F6F',
    textColor: '#FFFFFF',
    href: '#',
    children: 'Nav Link 2',
    key: 'nav-link-2'
  },
  {
    backgroundColor: '#2274A5',
    textColor: '#FFFFFF',
    href: '#',
    children: 'Nav Link 3',
    key: 'nav-link-3'
  },
  {
    backgroundColor: '#00A323',
    textColor: '#FFFFFF',
    href: '#',
    children: 'Nav Link 4',
    key: 'nav-link-4'
  },
  {
    backgroundColor: '#20E2E9',
    textColor: '#000000',
    href: '#',
    children: 'Nav Link 5',
    key: 'nav-link-5'
  }
]

const DashboardPage = () => {
  return(
    <DashboardLayout>
      <div className={styles.root}>
        <NavigationMosaic cardArray={cards} />
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
