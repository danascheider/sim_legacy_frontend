import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import paths from '../routing/paths'
import { backendBaseUri, sessionCookieName } from '../utils/config'
import ReactLoading from 'react-loading'
import DashboardHeader from '../components/dashboardHeader/dashboardHeader'
import styles from './dashboard.module.css'

const DashboardPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies([sessionCookieName])
  const [userData, setUserData] = useState(null)

  let shouldRedirect = !cookies[sessionCookieName]

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
        shouldRedirect = true
        return {}
      } else {
        return response.json()
      }
    })
    .then(data => setUserData(data))
    .catch(error => console.log(error))
  }

  useEffect(fetchUserData, [])

  return(!!shouldRedirect ?
    <Redirect to={paths.login} /> :
    <div className={styles.root}>
      {!!userData ? <DashboardHeader data={userData} /> : <ReactLoading type='spinningBubbles' color='#ccc' />}
    </div>
  )
}

export default DashboardPage
