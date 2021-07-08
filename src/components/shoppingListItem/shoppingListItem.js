import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { useColorScheme, useShoppingListContext } from '../../hooks/contexts'
import SlideToggle from 'react-slide-toggle'
import styles from './shoppingListItem.module.css'

const ShoppingListItem = ({
  itemId,
  canEdit,
  description,
  quantity,
  notes
}) => {
  const [toggleEvent, setToggleEvent] = useState(0)
  const [currentQuantity, setCurrentQuantity] = useState(quantity)

  const {
    schemeColorLighter,
    hoverColorLighter,
    textColorSecondary,
    borderColor,
    schemeColorLightest,
    textColorTertiary
  } = useColorScheme()

  const {
    performShoppingListItemUpdate,
    performShoppingListItemDestroy
  } = useShoppingListContext()

  const mountedRef = useRef(true)
  
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

  const incrementQuantity = () => {
    const oldQuantity = currentQuantity
    const newQuantity = currentQuantity + 1

    setCurrentQuantity(newQuantity)

    performShoppingListItemUpdate(itemId, { quantity: newQuantity }, null, () => { setCurrentQuantity(oldQuantity) })
  }

  const decrementQuantity = () => {
    const oldQuantity = currentQuantity
    const newQuantity = currentQuantity - 1

    if (newQuantity > 0) {
      setCurrentQuantity(newQuantity)
      performShoppingListItemUpdate(itemId, { quantity: newQuantity }, null, () => { setCurrentQuantity(oldQuantity) })
    } else if (newQuantity === 0) {
      const confirmed = window.confirm("Item quantity must be greater than zero. Delete the item instead?")

      if (confirmed) {
        performShoppingListItemDestroy(itemId, () => { mountedRef.current = false })
      } else {
        // show flash info message 'your item was not deleted' or something
      }
    }
  }

  useEffect(() => {
    setCurrentQuantity(quantity)
  }, [quantity])

  useEffect(() => (
    () => mountedRef.current = false
  ))

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.headerContainer}>
        <button className={styles.button} onClick={toggleDetails}>
          <h4 className={styles.description}>{description}</h4>
        </button>
        <span className={styles.quantity}>
          {canEdit && <div className={styles.icon} onClick={incrementQuantity}>
            <FontAwesomeIcon className={styles.fa} icon={faAngleUp} />
          </div>}
          <div className={styles.quantityContent}>
            {currentQuantity}
          </div>
          {canEdit && <div className={styles.icon} onClick={decrementQuantity}>
            <FontAwesomeIcon className={styles.fa} icon={faAngleDown} />
          </div>}
        </span>
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
  itemId: PropTypes.number.isRequired,
  canEdit: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  notes: PropTypes.string
}

export default ShoppingListItem
