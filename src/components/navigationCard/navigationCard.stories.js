import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import NavigationCard from './navigationCard'

export default { title: 'NavigationCard' }

export const Default = () => (
  <NavigationCard colorScheme={GREEN} href='#'>
    Your Shopping List
  </NavigationCard>
)
