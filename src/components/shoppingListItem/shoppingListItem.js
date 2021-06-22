import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import styles from './shoppingListItem.module.css'

const ShoppingListItem = ({
  description,
  quantity,
  notes,
  colorScheme
}) => {
  const {
    schemeColor,
    hoverColor,
    titleTextColor,
    borderColor,
    bodyBackgroundColor,
    bodyTextColor
  } = colorScheme

  const [toggleEvent, setToggleEvent] = useState(0)

  const toggleDetails = () => {
    setToggleEvent(Date.now)
  }

  const styleVars = {
    '--scheme-color': schemeColor,
    '--title-text-color': titleTextColor,
    '--border-color': borderColor,
    '--body-background-color': bodyBackgroundColor,
    '--body-text-color': bodyTextColor,
    '--hover-color': hoverColor
  }

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.headerContainer}>
        <button className={styles.button} onClick={toggleDetails}>
          <h4 className={styles.description}>{description}</h4>
        </button>
        <span className={styles.quantity}>{quantity}</span>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            <div className={styles.container}>
              <p className={styles.notes}>{notes || 'No details available'}</p>
            </div>
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

ShoppingListItem.propTypes = {
  colorScheme: PropTypes.shape.isRequired,
  description: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  notes: PropTypes.string
}

export default ShoppingListItem
