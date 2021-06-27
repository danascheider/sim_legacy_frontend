/*
 *
 * For more information about contexts and how they are used in SIM,
 * visit the docs on SIM contexts (/docs/contexts.md)
 *
 */

import { useContext } from 'react'
import { ColorContext } from '../contexts/colorContext'
import { DashboardContext } from '../contexts/dashboardContext'

const useCustomContext = (cxt, msg) => {
  const context = useContext(cxt)

  if (!context) {
    throw new Error(msg)
  }

  return context
}

export const useColorScheme = () => (
  useCustomContext(ColorContext, 'useColorScheme must be used within a ColorProvider')
)

export const useDashboardContext = () => (
  useCustomContext(DashboardContext, 'useDashboardContext must be used within a DashboardProvider')
)
