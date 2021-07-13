import React from 'react'
import { GREEN } from '../../utils/colorSchemes'
import { AppProvider } from '../../contexts/appContext'
import { ShoppingListProvider } from '../../contexts/shoppingListContext'
import {
  profileData,
  listItemData,
  shoppingLists
} from './storyData'
import ShoppingListItemEditForm from './shoppingListItemEditForm'

const appProviderOverrideValues = {
  token: 'xxxxxxxxxx',
  profileData
}


const containerStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)'
}

export default { title: 'ShoppingListItemEditForm' }

export const Default = () => (
  <AppProvider overrideValue={appProviderOverrideValues}>
    <ShoppingListProvider overrideValue={{ shoppingLists }}>
      <div style={containerStyle}>
        <ShoppingListItemEditForm listTitle={shoppingLists[1].title} buttonColor={GREEN} currentAttributes={listItemData} />
      </div>
    </ShoppingListProvider>
  </AppProvider>
)
