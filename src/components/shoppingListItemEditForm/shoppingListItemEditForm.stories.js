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

const noop = () => {}

export default { title: 'ShoppingListItemEditForm' }

export const Default = () => (
  <AppProvider overrideValue={appProviderOverrideValues}>
    <ShoppingListProvider overrideValue={{ shoppingLists, setFlashProps: noop, setFlashVisible: noop }}>
      <ShoppingListItemEditForm listTitle={shoppingLists[1].title} buttonColor={GREEN} currentAttributes={listItemData} />
    </ShoppingListProvider>
  </AppProvider>
)
