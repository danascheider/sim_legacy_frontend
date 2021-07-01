import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingListItemCreateForm from './shoppingListItemCreateForm'

export default { title: 'ShoppingListItemCreateForm' }

export const Default = () => <ColorProvider colorScheme={GREEN}><ShoppingListItemCreateForm listId={3} /></ColorProvider>
