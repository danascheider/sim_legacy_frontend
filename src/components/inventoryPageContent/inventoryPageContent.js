import React from 'react'
import colorSchemes, { YELLOW } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext, useInventoryListsContext } from '../../hooks/contexts'
import withModal from '../../hocs/withModal'
import { ColorProvider } from '../../contexts/colorContext'
import { LOADING, DONE, ERROR } from '../../utils/loadingStates'
import Loading from '../loading/loading'
import LoadingError from '../loadingError/loadingError'
import InventoryList from '../inventoryList/inventoryList'
import ModalGameForm from '../modalGameForm/modalGameForm'
import styles from './inventoryPageContent.module.css'

const InventoryPageContent = () => {
  const { setModalAttributes, setModalVisible } = useAppContext()
  const { games, gameLoadingState } = useGamesContext()
  const { inventoryLists, inventoryListLoadingState } = useInventoryListsContext()

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

   const listsLoadedAndNotEmpty = inventoryLists && inventoryListLoadingState === DONE && inventoryLists.length > 0
   const listsLoadedAndEmpty = inventoryLists && inventoryListLoadingState === DONE && inventoryLists.length === 0

   /*
    *
    * Return appropriate values for component state
    *
    */
    if (gameLoadingState === DONE && !games.length) {
      return(
        <p className={styles.noLists}>
          You need a game to use the inventory lists feature. <button className={styles.link} onClick={showGameForm}>Create a game</button> to get started.
        </p>
      )
    } else if (listsLoadedAndNotEmpty) {
      return(
        <>
          {inventoryLists.map(({ id, title, aggregate }, index) => {
            // If there are more lists than colour schemes, cycle through the colour schemes
            const colorSchemesIndex = index < colorSchemes.length ? index : index % colorSchemes.length
            const colorScheme = colorSchemes[colorSchemesIndex]
            const listKey = title.toLowerCase().replace(' ', '-')

            return(
              <ColorProvider key={listKey} colorScheme={colorScheme}>
                <div className={styles.inventoryList}>
                  <InventoryList
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
      return <p className={styles.noLists}>This game has no inventory lists.</p>
    } else if (inventoryListLoadingState === LOADING) {
      return <Loading className={styles.loading} color={YELLOW.schemeColorDarkest} height='15%' width='15%' />
    } else if (gameLoadingState === ERROR || inventoryListLoadingState === ERROR) {
      // It's possible both are errored but we'll worry about games first
      const name = gameLoadingState === ERROR ? 'games' : 'inventory lists'
      return <LoadingError modelName={name} />
    } else {
      return null
    }
}

export default InventoryPageContent
