import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import NavigationCard from './navigationCard'

export default { title: 'NavigationCard' }

export const Default = () => (
  <ColorProvider colorScheme={GREEN}>
    <NavigationCard colorScheme={GREEN} href='#'>
      Your Shopping Lists
    </NavigationCard>
  </ColorProvider>
)
