import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useColorScheme } from '../../hooks/contexts'
import SlideToggle from 'react-slide-toggle'
import styles from './shoppingListItem.module.css'

const ShoppingListItem = ({
  description,
  quantity,
  notes
}) => {
  const [toggleEvent, setToggleEvent] = useState(0)

  const {
    schemeColorLighter,
    hoverColorLighter,
    textColorSecondary,
    borderColor,
    schemeColorLightest,
    textColorTertiary
  } = useColorScheme()
  
  const toggleDetails = () => {
    setToggleEvent(Date.now)
  }

  const styleVars = {
    '--main-color': schemeColorLighter,
    '--title-text-color': textColorSecondary,
    '--border-color': borderColor,
    '--body-background-color': schemeColorLightest,
    '--body-text-color': textColorTertiary,
    '--hover-color': hoverColorLighter
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
            <p className={styles.notes}>{notes || 'No details available'}</p>
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
