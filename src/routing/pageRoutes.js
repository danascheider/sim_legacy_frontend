import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AppProvider } from '../contexts/appContext'
import DashboardPage from '../pages/dashboardPage/dashboardPage'
import ShoppingListPage from '../pages/shoppingListPage/shoppingListPage'
import HomePage from '../pages/homePage/homePage'
import LoginPage from '../pages/loginPage/loginPage'
import NotFoundPage from '../pages/notFoundPage/notFoundPage'
import paths from './paths'
import { ShoppingListProvider } from '../contexts/shoppingListContext'

const siteTitle = 'Skyrim Inventory Management |'

const pages = [
  {
    pageId: 'home',
    title: `${siteTitle} Home`,
    description: 'Manage your inventory across multiple properties in Skyrim',
    jsx: <HomePage />,
    path: paths.home
  },
  {
    pageId: 'login',
    title: `${siteTitle} Login`,
    description: 'Log into Skyrim Inventory Management using your Google account',
    jsx: <LoginPage />,
    path: paths.login
  },
  {
    pageId: 'dashboard',
    title: `${siteTitle} Dashboard`,
    description: 'Skyrim Inventory Management User Dashboard',
    jsx: <DashboardPage />,
    path: paths.dashboard.main
  },
  {
    pageId: 'shoppingLists',
    title: `${siteTitle} Manage Shopping Lists`,
    description: 'Manage Skyrim Shopping Lists',
    jsx: <ShoppingListProvider><ShoppingListPage /></ShoppingListProvider>,
    path: paths.dashboard.shoppingLists
  }
]

const PageRoutes = () => (
  <Switch>
    {pages.map(
      ({ pageId, title, description, jsx, path }) => {
        return(
          <Route exact path={path} key={pageId}>
            <Helmet>
              <html lang='en' />

              <title>{title}</title>
              <meta name='description' content={description} />
            </Helmet>
            <AppProvider startingPath={path}>
              {jsx}
            </AppProvider>
          </Route>
        )
      }
    )}
    <Route key='notFound'>
      <Helmet>
        <html lang='en' />

        <title>Skyrim Inventory Management | Page Not Found</title>
        <meta name='description' content='Skyrim Inventory Management could not find the page you were looking for' />
      </Helmet>
      <AppProvider>
        <NotFoundPage />
      </AppProvider>
    </Route>
  </Switch>
)

export default PageRoutes
