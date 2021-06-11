import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import HomePage from '../pages/home'
import PageIdContext from '../contexts/pageIdContext'
import paths from './paths'
import splashStyles from '../splash.css'

const commonDescription = 'Manage your inventory across multiple properties in Skyrim'

let pages = [
  {
    pageId: 'home',
    title: 'Skyrim Inventory Management | Home',
    description: commonDescription,
    splash: true,
    Component: HomePage,
    path: paths.home
  }
]

const PageRoutes = () => (
  <Switch>
    {pages.map(
      ({ path, title, description, splash, Component, pageId }) => (
        <Route exact path={path} key={path}>
          <PageIdContext.Provider value={pageId}>
            <Helmet>
              <html lang="en" style={splash ? splashStyles : null} />

              <title>{title}</title>
              <meta name='description' content={description} />
            </Helmet>
            <Component />
          </PageIdContext.Provider>
        </Route>
      )
    )}
  </Switch>
)

export default PageRoutes
