import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import paths from '../routing/paths'
import { backendBaseUri, sessionCookieName } from '../utils/config'
import ReactLoading from 'react-loading'
import DashboardHeader from '../components/dashboardHeader/dashboardHeader'
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
  const [cookies, , removeCookie] = useCookies([sessionCookieName])
  const [userData, setUserData] = useState(null)
  const [shouldRedirect, setShouldRedirect] = useState(!cookies[sessionCookieName])

  const fetchUserData = () => {
    const dataUri = `${backendBaseUri[process.env.NODE_ENV]}/users/current`

    fetch(dataUri, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies[sessionCookieName]}`
      }
    })
    .then(response => {
      console.log('Response from API: ', response)
      if (response.status === 401) {
        removeCookie(sessionCookieName)
        setShouldRedirect(true)
        return {}
      } else {
        return response.json()
      }
    })
    .then(data => setUserData(data))
    .catch(error => console.log(error))
  }

  useEffect(fetchUserData, [cookies, removeCookie])

  return(!!shouldRedirect ?
    <Redirect to={paths.login} /> :
    <>
      {!!userData ? <DashboardHeader data={userData} /> : <ReactLoading type='spinningBubbles' color='#ccc' />}
      <div className={styles.body}><NavigationMosaic cardArray={cards} /></div>
    </>
  )
}

export default DashboardPage
