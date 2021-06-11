import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PageRoutes from './routing/pageRoutes'

const App = () => (
  <BrowserRouter>
    <HelmetProvider>
      <PageRoutes />
    </HelmetProvider>
  </BrowserRouter>
)

export default App;
