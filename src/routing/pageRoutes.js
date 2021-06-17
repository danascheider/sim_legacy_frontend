import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import HomePage from '../pages/home'
import LoginPage from '../pages/login'
import LogoutPage from '../pages/logout'
import paths from './paths'
import splashStyles from '../splash.css'

const PageRoutes = () => {
  const siteTitle = 'Skyrim Inventory Management |'
  
  const pages = [
    {
      pageId: 'home',
      title: `${siteTitle} Home`,
      description: 'Manage your inventory across multiple properties in Skyrim',
      splash: true,
      Component: HomePage,
      path: paths.home,
      pageProps: {}
    },
    {
      pageId: 'login',
      title: `${siteTitle} Login`,
      description: 'Log into Skyrim Inventory Management using your Google account',
      splash: false,
      Component: LoginPage,
      path: paths.login,
      pageProps: {}
    },
    {
      pageId: 'logout',
      title: `${siteTitle} Logout`,
      description: 'Log out of Skyrim Inventory Management with your Google account',
      splash: false,
      Component: LogoutPage,
      path: paths.logout,
      pageProps: {}
    }
  ]

  return(
    <Switch>
      {pages.map(
        ({ pageId, title, description, splash, Component, path, pageProps }) => {
          return(
            <Route exact path={path} key={pageId}>
              <Helmet>
                <html lang="en" style={splash ? splashStyles : null} />

                <title>{title}</title>
                <meta name='description' content={description} />
              </Helmet>
              <Component {...pageProps} />
            </Route>
          )
        }
      )}
    </Switch>
  )
}

export default PageRoutes
