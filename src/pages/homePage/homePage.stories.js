import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import HomePage from './homePage'

export default { title: 'HomePage' }

export const Default = () => <AppProvider><HomePage /></AppProvider>
