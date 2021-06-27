import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { DashboardProvider } from '../contexts/dashboardContext'
import DashboardPage from '../pages/dashboardPage/dashboardPage'
import ShoppingListPage from '../pages/shoppingListPage/shoppingListPage'
import HomePage from '../pages/homePage/homePage'
import LoginPage from '../pages/loginPage/loginPage'
import paths from './paths'

const siteTitle = 'Skyrim Inventory Management |'

const pages = [
  {
    pageId: 'home',
    title: `${siteTitle} Home`,
    description: 'Manage your inventory across multiple properties in Skyrim',
    Component: HomePage,
    path: paths.home,
    isDashboard: false
  },
  {
    pageId: 'login',
    title: `${siteTitle} Login`,
    description: 'Log into Skyrim Inventory Management using your Google account',
    Component: LoginPage,
    path: paths.login,
    isDashboard: false
  },
  {
    pageId: 'dashboard',
    title: `${siteTitle} Dashboard`,
    description: 'Skyrim Inventory Management User Dashboard',
    Component: DashboardPage,
    path: paths.dashboard.main,
    isDashboard: true
  },
  {
    pageId: 'shoppingLists',
    title: `${siteTitle} Manage Shopping Lists`,
    description: 'Manage Skyrim Shopping Lists',
    Component: ShoppingListPage,
    path: paths.dashboard.shoppingLists,
    isDashboard: true
  }
]

const pagesWithoutDashboardContext = pages.filter(page => !page.isDashboard && page.path !== paths.login)
const pagesWithDashboardContext = pages.filter(page => page.isDashboard || page.path === paths.login)

const PageRoutes = () => (
  <Switch>
    {pagesWithoutDashboardContext.map(
      ({ pageId, title, description, Component, path }) => {
        return(
          <Route exact path={path} key={pageId}>
            <Helmet>
              <html lang='en' />

              <title>{title}</title>
              <meta name='description' content={description} />
            </Helmet>
            <Component />
          </Route>
        )
      }
    )}
    <DashboardProvider>
      {pagesWithDashboardContext.map(
        ({ pageId, title, description, Component, path }) => {
          return(
            <Route exact path={path} key={pageId}>
              <Helmet>
                <html lang='en' />

                <title>{title}</title>
                <meta name='description' content={description} />
              </Helmet>
              <Component />
            </Route>
          )
        }
      )}
    </DashboardProvider>
  </Switch>
)

export default PageRoutes
