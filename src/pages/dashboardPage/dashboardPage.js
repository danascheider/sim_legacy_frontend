import React, { useState, useEffect, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import {
  YELLOW,
  PINK,
  BLUE,
  GREEN,
  AQUA
} from '../../utils/colorSchemes'
import { backendBaseUri } from '../../utils/config'
import isStorybook from '../../utils/isStorybook'
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
  const {
    token,
    setProfileData,
    removeSessionCookie
  } = useDashboardContext()

  const [shouldRedirect, setShouldRedirect] = useState(!token)

  const mountedRef = useRef(true)

  const fetchProfileData = () => {
    const dataUri = `${backendBaseUri[process.env.NODE_ENV]}/users/current`

    if (mountedRef.current === true && (isStorybook() || !!token)) {
      fetch(dataUri, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => (response.json()))
        // TODO: https://trello.com/c/JRyN8FSN/25-refactor-error-handling-in-promise-chains
        .then(data => {
          if (!data) {
            console.warn('No data received from server - logging out user just in case')
            token && removeSessionCookie()
            setShouldRedirect(true)
          } else if (data.error) {
            console.warn('Error fetching user data - logging out user: ', data.error)
            token && removeSessionCookie()
            setShouldRedirect(true)
          } else {
            setProfileData(data)
            setShouldRedirect(false)
          }
        })
        .catch(error => {
          console.error('Error returned while fetching profile data: ', error.message)
          token && removeSessionCookie()
          setShouldRedirect(true)
        })
    } else {
      token && removeSessionCookie()
      setShouldRedirect(true)
    }
  }

  useEffect(fetchProfileData, [])
  
  return(shouldRedirect ?
    <Redirect to={paths.login} /> :
    <DashboardLayout>
      <div className={styles.root}>
        <NavigationMosaic cardArray={cards} />
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
