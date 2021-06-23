import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import styles from './shoppingList.module.css'

const ShoppingList = ({ title, colorScheme, listItems = [] }) => {
  const {
    schemeColor,
    hoverColor,
    borderColor,
    textColorPrimary,
    schemeColorLighter,
    hoverColorLighter,
    schemeColorLightest,
    textColorSecondary,
    textColorTertiary,
  } = colorScheme

  const listItemColorScheme = {
    schemeColor: schemeColorLighter,
    hoverColor: hoverColorLighter,
    borderColor: borderColor,
    titleTextColor: textColorSecondary,
    bodyBackgroundColor: schemeColorLightest,
    bodyTextColor: textColorTertiary
  }

  const [toggleEvent, setToggleEvent] = useState(0)

  const toggleListItems = () => {
    setToggleEvent(Date.now)
  }

  const styleVars = {
    '--scheme-color': schemeColor,
    '--border-color': borderColor,
    '--text-color': textColorPrimary,
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
            {listItems.map(({ id, description, quantity, notes }) => {
              const itemKey = `${title.toLowerCase().replace(' ', '-')}-${id}`

              return(
                <ShoppingListItem
                  key={itemKey}
                  description={description}
                  quantity={quantity}
                  notes={notes}
                  colorScheme={listItemColorScheme}
                />
              )
            })}
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

ShoppingList.propTypes = {
  title: PropTypes.string.isRequired,
  colorScheme: PropTypes.shape({
    schemeColor: PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    schemeColorLighter: PropTypes.string.isRequired,
    hoverColorLighter: PropTypes.string.isRequired,
    schemeColorLightest: PropTypes.string.isRequired,
    textColorSecondary: PropTypes.string.isRequired,
    textColorTertiary: PropTypes.string.isRequired
  }).isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape).isRequired
}

export default ShoppingList
