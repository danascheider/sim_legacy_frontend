import React from 'react'
import colorSchemes, { YELLOW } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext, useShoppingListsContext } from '../../hooks/contexts'
import withModal from '../../hocs/withModal'
import { ColorProvider } from '../../contexts/colorContext'
import { shoppingListLoadingStates } from '../../contexts/shoppingListsContext'
import Loading from '../loading/loading'
import ShoppingList from '../shoppingList/shoppingList'
import ModalGameForm from '../modalGameForm/modalGameForm'
import styles from './shoppingListsPageContent.module.css'

const { LOADING, DONE } = shoppingListLoadingStates

const ShoppingListsPageContent = () => {
  const { setModalAttributes, setModalVisible } = useAppContext()
  const { games, gameLoadingState } = useGamesContext()
  const { shoppingLists, shoppingListLoadingState } = useShoppingListsContext()

  /*
   *
   * Define click handler
   *
   */

  const showGameForm = e => {
    e.preventDefault()

    setModalAttributes({
      Tag: withModal(ModalGameForm),
      props: {
        title: 'Create Game',
        type: 'create'
      }
    })

    setModalVisible(true)
  }

  /*
   *
   * Define possible states that affect content
   * 
   */

  const listsLoadedAndNotEmpty = shoppingLists && shoppingListLoadingState === DONE && shoppingLists.length > 0
  const listsLoadedAndEmpty = shoppingLists && shoppingListLoadingState === DONE && shoppingLists.length === 0

  /*
   *
   * Return appropriate values for the state the component is in
   * 
   */
  if (gameLoadingState === DONE && !games.length) {
    return(
      <p className={styles.noLists}>
        You need a game to use the shopping lists feature. <a className={styles.link} href='#' onClick={showGameForm}>Create a game</a> to get started.
      </p>
    )
  } else if (listsLoadedAndNotEmpty) {
    return(
      <>
        {shoppingLists.map(({ id, title, aggregate }, index) => {

          // If there are more lists than colour schemes, cycle through the colour schemes
          const colorSchemesIndex = index < colorSchemes.length ? index : index % colorSchemes.length
          const colorScheme = colorSchemes[colorSchemesIndex]
          const listKey = title.toLowerCase().replace(' ', '-')

          return (
            <ColorProvider key={listKey} colorScheme={colorScheme}>
              <div className={styles.shoppingList}>
                <ShoppingList
                  canEdit={!aggregate}
                  listId={id}
                  title={title}
                />
              </div>
            </ColorProvider>
          )
        })}
      </>
    )
  } else if (listsLoadedAndEmpty) {
    return <p className={styles.noLists}>This game has no shopping lists.</p>
  } else if (shoppingListLoadingState === LOADING) {
    return <Loading className={styles.loading} color={YELLOW.schemeColorDarkest} height='15%' width='15%' />
  } else {
    return null
  }
}

export default ShoppingListsPageContent
