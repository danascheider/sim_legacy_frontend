import React from 'react'
import PropTypes from 'prop-types'
import colorSchemes from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ShoppingList from '../shoppingList/shoppingList'
import styles from './shoppingListPageContent.module.css'

const ShoppingListPageContent = ({ lists, onSubmitEditForm }) => {
  if (lists.length === 0) {
    return <p className={styles.noLists}>You have no shopping lists.</p>
  } else {
    return (
      <>
        {lists.map(({ id, title, master, shopping_list_items }, index) => {
          // If there are more lists than colour schemes, cycle through the colour schemes
          const colorSchemesIndex = index < colorSchemes.length ? index : index % colorSchemes.length
          const listKey = title.toLowerCase().replace(' ', '-')

          return (
            <ColorProvider key={listKey} colorScheme={colorSchemes[colorSchemesIndex]}>
              <div className={styles.shoppingList}>
                <ShoppingList
                  canEdit={!master}
                  listId={id}
                  title={title}
                  listItems={shopping_list_items}
                  onSubmitEditForm={(e, success, error) => onSubmitEditForm(id, e, success, error)}
                />
              </div>
            </ColorProvider>
          )
        })}
      </>
    )
  }
}

ShoppingListPageContent.propTypes = {
  lists: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    master: PropTypes.bool.isRequired,
    shopping_list_items: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      notes: PropTypes.string
    })).isRequired
  })).isRequired,
  onSubmitEditForm: PropTypes.func.isRequired
}

export default ShoppingListPageContent
