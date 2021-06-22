import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import styles from './shoppingList.module.css'

const ShoppingList = ({ title, colorScheme, listItems = [] }) => {
  const {
    outerColor,
    borderColor,
    textColor,
    hoverColor,
    listItemHeaderColor,
    listItemHoverColor,
    listItemBorderColor,
    listItemBodyBackgroundColor,
    listItemTitleTextColor,
    listItemBodyTextColor
  } = colorScheme

  const listItemColorScheme = {
    schemeColor: listItemHeaderColor,
    hoverColor: listItemHoverColor,
    borderColor: listItemBorderColor,
    titleTextColor: listItemTitleTextColor,
    bodyBackgroundColor: listItemBodyBackgroundColor,
    bodyTextColor: listItemBodyTextColor
  }

  const [toggleEvent, setToggleEvent] = useState(0)

  const toggleListItems = () => {
    setToggleEvent(Date.now)
  }

  const styleVars = {
    '--scheme-color': outerColor,
    '--border-color': borderColor,
    '--text-color': textColor,
    '--hover-color': hoverColor
  }

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.titleContainer}>
        <button className={styles.button} onClick={toggleListItems}>
          <h3 className={styles.title}>{title}</h3>
        </button>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            {listItems.map(({ id, description, quantity, notes }) => (
              <ShoppingListItem
                key={`shopping-list-item-${id}`}
                description={description}
                quantity={quantity}
                notes={notes}
                colorScheme={listItemColorScheme}
              />
            ))}
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

ShoppingList.propTypes = {
  title: PropTypes.string.isRequired,
  colorScheme: PropTypes.shape.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape).isRequired
}

export default ShoppingList
