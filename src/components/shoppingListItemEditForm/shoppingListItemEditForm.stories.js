import React from 'react'
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

const noop = () => {}

export default { title: 'ShoppingListItemEditForm' }

export const Default = () => (
  <AppProvider overrideValue={appProviderOverrideValues}>
    <ShoppingListProvider overrideValue={{ shoppingLists, setFlashProps: noop, setFlashVisible: noop }}>
      <ShoppingListItemEditForm currentAttributes={listItemData} />
    </ShoppingListProvider>
  </AppProvider>
)
