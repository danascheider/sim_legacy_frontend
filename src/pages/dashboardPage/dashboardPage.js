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
import Loading from '../../components/loading/loading'
import NavigationMosaic from '../../components/navigationMosaic/navigationMosaic'
import styles from './dashboardPage.module.css'

const cards = [
  {
    colorScheme: YELLOW,
    href: '#',
    children: 'Your Games',
    key: 'your-games'
  },
  {
    colorScheme: PINK,
    href: '#',
    children: 'Your Shopping Lists',
    key: 'your-shopping-lists'
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
  const { token, profileLoadState } = useDashboardContext()
  
  return(token ?
    <DashboardLayout>
      {profileLoadState === 'done' ? <div className={styles.root}>
        <NavigationMosaic cardArray={cards} />
      </div> :
      <Loading className={styles.loading} type='bubbles' color={YELLOW.schemeColor} height='15%' width='15%' />}
    </DashboardLayout> :
    <Redirect to={paths.login} />
  )
}

export default DashboardPage
