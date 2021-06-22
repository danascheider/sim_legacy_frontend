import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import styles from './shoppingListItem.module.css'

const ShoppingListItem = ({ description, quantity, notes }) => {
  const [toggleEvent, setToggleEvent] = useState(0)

  const toggleDetails = () => {
    setToggleEvent(Date.now)
  }

  return(
    <div className={styles.root}>
      <button className={styles.titleBar} onClick={toggleDetails}>
        <span><h3 className={styles.description}>{description}</h3></span>
        <span className={styles.quantity}>{quantity}</span>
      </button>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible}>
            <div className={styles.collapsibleContent} ref={setCollapsibleElement}>
              {notes}
            </div>
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

ShoppingListItem.propTypes = {
  description: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  notes: PropTypes.string
}

export default ShoppingListItem
