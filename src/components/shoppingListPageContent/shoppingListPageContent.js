import React, { useEffect } from 'react'
import colorSchemes, { YELLOW } from '../../utils/colorSchemes'
import { useShoppingListContext } from '../../hooks/contexts'
import { ColorProvider } from '../../contexts/colorContext'
import Loading from '../loading/loading'
import ShoppingList from '../shoppingList/shoppingList'
import styles from './shoppingListPageContent.module.css'

const ShoppingListPageContent = () => {
  const { shoppingLists, shoppingListLoadingState } = useShoppingListContext()

  /*
   *
   * Define possible states that affect content
   * 
   */

  // Expected states
  const happyPathNonEmpty = shoppingLists && shoppingListLoadingState === 'done' && shoppingLists.length > 0
  const happyPathEmpty = shoppingLists && shoppingListLoadingState === 'done' && shoppingLists.length === 0

  // Unexpected but possible states
  const missingListsDone = !shoppingLists && shoppingListLoadingState === 'done'
  const missingListsError = !shoppingLists && shoppingListLoadingState === 'error'

  // These states should definitely not be occurring but sometimes shit goes sideways
  const hasListsWithError = shoppingLists && shoppingListLoadingState === 'error'

  /*
   *
   * Return appropriate values for the state the component is in
   * 
   */

  if (happyPathEmpty) return <p className={styles.noLists}>You have no shopping lists.</p>
  if (happyPathNonEmpty) {
    return(
      <>
        {shoppingLists.map(({ id, title, master }, index) => {
          // If there are more lists than colour schemes, cycle through the colour schemes
          const colorSchemesIndex = index < colorSchemes.length ? index : index % colorSchemes.length
          const colorScheme = colorSchemes[colorSchemesIndex]
          const listKey = title.toLowerCase().replace(' ', '-')

          return (
            <ColorProvider key={listKey} colorScheme={colorScheme}>
              <div className={styles.shoppingList}>
                <ShoppingList
                  canEdit={!master}
                  listId={id}
                  title={title}
                />
              </div>
            </ColorProvider>
          )
        })}
      </>
    )
  }
  if (shoppingListLoadingState === 'loading') return <Loading className={styles.loading} color={YELLOW.schemeColor} height='15%' width='15%' />
  if (missingListsDone || missingListsError || hasListsWithError) {
    return <p className={styles.error}>There was an error loading your lists. It may have been on our end. We're sorry!</p>
  }
}

export default ShoppingListPageContent
