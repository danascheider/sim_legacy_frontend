import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PageRoutes from './routing/pageRoutes'

const App = () => (
  <Router basename={process.env.PUBLIC_URL}>
    <HelmetProvider>
      <PageRoutes />
    </HelmetProvider>
  </Router>
)

export default App;
