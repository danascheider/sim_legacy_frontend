import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  YELLOW,
  PINK,
  BLUE,
  GREEN,
  AQUA
} from '../../utils/colorSchemes'
import paths from '../../routing/paths'
import { useDashboardContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import NavigationMosaic from '../../components/navigationMosaic/navigationMosaic'
import styles from './dashboardPage.module.css'

const cards = [
  {
    colorScheme: YELLOW,
    href: paths.dashboard.shoppingLists,
    children: 'Your Shopping Lists',
    key: 'shopping-lists'
  },
  {
    colorScheme: PINK,
    href: '#',
    children: 'Nav Link 2',
    key: 'nav-link-2'
  },
  {
    colorScheme: BLUE,
    href: '#',
    children: 'Nav Link 3',
    key: 'nav-link-3'
  },
  {
    colorScheme: GREEN,
    href: '#',
    children: 'Nav Link 4',
    key: 'nav-link-4'
  },
  {
    colorScheme: AQUA,
    href: '#',
    children: 'Nav Link 5',
    key: 'nav-link-5'
  }
]

const DashboardPage = () => {
  const { token } = useDashboardContext()
  
  return(token ?
    <DashboardLayout>
      <div className={styles.root}>
        <NavigationMosaic cardArray={cards} />
      </div>
    </DashboardLayout> :
    <Redirect to={paths.login} />
  )
}

export default DashboardPage
