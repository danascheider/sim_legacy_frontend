import React, { useRef, useEffect } from 'react'
import {
  YELLOW,
  PINK,
  BLUE,
  GREEN,
  AQUA
} from '../../utils/colorSchemes'
import { isStorybook } from '../../utils/isTestEnv'
import paths from '../../routing/paths'
import { useAppContext } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout'
import Loading from '../../components/loading/loading'
import NavigationMosaic from '../../components/navigationMosaic/navigationMosaic'
import styles from './dashboardPage.module.css'

const cards = [
  {
    colorScheme: YELLOW,
    href: paths.dashboard.games,
    children: 'Your Games',
    key: 'your-games'
  },
  {
    colorScheme: PINK,
    href: paths.dashboard.shoppingLists,
    children: 'Your Shopping Lists',
    key: 'your-shopping-lists'
  },
  {
    colorScheme: BLUE,
    href: paths.dashboard.inventory,
    children: 'Your Inventory',
    key: 'your-inventory'
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
  const { token, profileLoadState, setShouldRedirectTo } = useAppContext()
  const mountedRef = useRef(true)

  useEffect(() => {
    if (!token && !isStorybook) {
      setShouldRedirectTo(paths.login)
      mountedRef.current = false
    }

    return () => mountedRef.current = false
  }, [token, setShouldRedirectTo])
  
  return(
    <DashboardLayout>
      {profileLoadState === 'done' ? <div className={styles.root}>
        <NavigationMosaic cardArray={cards} />
      </div> :
      <Loading className={styles.loading} type='bubbles' color={YELLOW.schemeColorDarkest} height='15%' width='15%' />}
    </DashboardLayout>
  )
}

export default DashboardPage
