import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import DashboardPage from '../pages/dashboard'
import HomePage from '../pages/home'
import LoginPage from '../pages/login'
import paths from './paths'

const siteTitle = 'Skyrim Inventory Management |'

const pages = [
  {
    pageId: 'home',
    title: `${siteTitle} Home`,
    description: 'Manage your inventory across multiple properties in Skyrim',
    Component: HomePage,
    path: paths.home
  },
  {
    pageId: 'login',
    title: `${siteTitle} Login`,
    description: 'Log into Skyrim Inventory Management using your Google account',
    baseStyles: null,
    Component: LoginPage,
    path: paths.login
  },
  {
    pageId: 'dashboard',
    title: `${siteTitle} Dashboard`,
    description: 'Skyrim Inventory Management User Dashboard',
    Component: DashboardPage,
    path: paths.dashboard.main
  }
]

const PageRoutes = () => (
  <Switch>
    {pages.map(
      ({ pageId, title, description, baseStyles, Component, path }) => {
        return(
          <Route exact path={path} key={pageId}>
            <Helmet>
              <html lang="en" style={baseStyles} />

              <title>{title}</title>
              <meta name='description' content={description} />
            </Helmet>
            <Component />
          </Route>
        )
      }
    )}
  </Switch>
)

export default PageRoutes
