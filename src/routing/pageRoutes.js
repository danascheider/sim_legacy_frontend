import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import HomePage from '../pages/home'
import LoginPage from '../pages/login'
import PageIdContext from '../contexts/pageIdContext'
import paths from './paths'
import { backendBaseUri } from '../utils/config'
import splashStyles from '../splash.css'

const PageRoutes = () => {
  const siteTitle = 'Skyrim Inventory Management |'
  
  const [loggedInUser, setLoggedInUser] = useState(null)

  const loginSuccessCallback = ({ qc }) => {
    const backendUri = `${backendBaseUri[process.env.NODE_ENV]}/users/logged_in`

    fetch(backendUri, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${qc.id_token}`
      }
    })
    .then(response => (response.json()))
    .then(data => {
      console.log(data)
      setLoggedInUser(data)
    })
    .catch(error => console.log(error))
  }

  const loginFailureCallback = (resp) => {
    console.log('Login Failure: ', resp)
    setLoggedInUser(null)
  }

  const allPages = [
    {
      pageId: 'home',
      title: `${siteTitle} Home`,
      description: 'Manage your inventory across multiple properties in Skyrim',
      splash: true,
      Component: HomePage,
      path: paths.home,
      allowed: true,
      pageProps: {}
    },
    {
      pageId: 'login',
      title: `${siteTitle} Login`,
      description: 'Log into Skyrim Inventory Management using your Google account',
      splash: false,
      Component: LoginPage,
      path: paths.login,
      allowed: true,
      pageProps: {
        loginSuccessCallback: loginSuccessCallback,
        loginFailureCallback: loginFailureCallback,
        userLoggedIn: !!loggedInUser
      },
    },
    {
      pageId: 'logout',
      title: `${siteTitle} Logout`,
      description: 'Log out of Skyrim Inventory Management with your Google account',
      splash: false,
      Component: () => <div></div>,
      path: paths.logout,
      allowed: !!loggedInUser,
      pageProps: {}
    }
  ]

  const allowedPages = allPages.filter(page => (page.allowed === true))

  return(
    <Switch>
      {allowedPages.map(
        ({ pageId, title, description, splash, Component, path, pageProps }) => {
          return(
            <Route exact path={path} key={pageId}>
              <PageIdContext.Provider value={pageId}>
                <Helmet>
                  <html lang="en" style={splash ? splashStyles : null} />

                  <title>{title}</title>
                  <meta name='description' content={description} />
                </Helmet>
                <Component pageProps={pageProps}/>
              </PageIdContext.Provider>
            </Route>
          )
        }
      )}
    </Switch>
  )
}

export default PageRoutes
