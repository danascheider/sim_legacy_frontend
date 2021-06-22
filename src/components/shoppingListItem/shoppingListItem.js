import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import SlideToggle from 'react-slide-toggle'
import styles from './shoppingListItem.module.css'

const ShoppingListItem = ({
  description,
  quantity,
  notes,
  colorScheme
}) => {
  const { schemeColor, textColor, borderColor, bodyBackgroundColor } = colorScheme

  const [toggleEvent, setToggleEvent] = useState(0)

  const toggleDetails = () => {
    setToggleEvent(Date.now)
  }

  const styleVars = {
    '--scheme-color': schemeColor,
    '--text-color': textColor,
    '--border-color': borderColor,
    '--body-background-color': bodyBackgroundColor
  }

  return(
    <div className={styles.root} style={styleVars}>
      <div className={classnames(styles.headerBar, styles.flexItem)}>
        <button className={styles.button} onClick={toggleDetails}>
          <h3 className={styles.description}>{description}</h3>
        </button>
        <span className={classnames(styles.quantity, styles.flexItem)}>{quantity}</span>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible}>
            <div className={styles.collapsibleContent} ref={setCollapsibleElement}>
              {notes || 'No details available'}
            </div>
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

ShoppingListItem.propTypes = {
  className: PropTypes.string.isRequired,
  colorScheme: PropTypes.shape.isRequired,
  description: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  notes: PropTypes.string
}

export default ShoppingListItem
