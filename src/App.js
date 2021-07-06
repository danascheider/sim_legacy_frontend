import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CookiesProvider } from 'react-cookie'
import PageRoutes from './routing/pageRoutes'

const App = () => {
  return(
    <Router basename={process.env.PUBLIC_URL}>
      <HelmetProvider>
        <CookiesProvider>
          <PageRoutes />
        </CookiesProvider>
      </HelmetProvider>
    </Router>
  )
}
export default App;
