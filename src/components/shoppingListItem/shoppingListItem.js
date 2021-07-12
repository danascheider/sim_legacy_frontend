import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faAngleUp, faAngleDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useColorScheme, useShoppingListContext } from '../../hooks/contexts'
import SlideToggle from 'react-slide-toggle'
import styles from './shoppingListItem.module.css'

const ShoppingListItem = ({
  itemId,
  listTitle,
  canEdit,
  description,
  quantity,
  notes
}) => {
  const [toggleEvent, setToggleEvent] = useState(0)

  // This enables us to set the quantity to the new quantity during the time between when
  // the user increments/decrements the quantity and the time the API responds.
  const [currentQuantity, setCurrentQuantity] = useState(quantity)

  const {
    schemeColor,
    textColorPrimary,
    hoverColor,
    schemeColorLighter,
    hoverColorLighter,
    textColorSecondary,
    borderColor,
    schemeColorLightest,
    textColorTertiary
  } = useColorScheme()

  const {
    performShoppingListItemUpdate,
    performShoppingListItemDestroy,
    setFlashProps,
    setFlashVisible,
    setListItemEditFormProps,
    setListItemEditFormVisible
  } = useShoppingListContext()

  const mountedRef = useRef(true)
  const headerRef = useRef(null)
  const iconsRef = useRef(null)
  const editRef = useRef(null)
  const deleteRef = useRef(null)
  const incRef = useRef(null)
  const decRef = useRef(null)

  const refContains = (ref, el) => ref.current && (ref.current === el || ref.current.contains(el))
  const editRefContains = el => refContains(editRef, el)
  const deleteRefContains = el => refContains(deleteRef, el)
  const incRefContains = el => refContains(incRef, el)
  const decRefContains = el => refContains(decRef, el)
  const iconContains = el => editRefContains(el) || deleteRefContains(el) || incRefContains(el) || decRefContains(el)
  
  const toggleDetails = e => {
    if (!e || !iconContains(e.target)) setToggleEvent(Date.now)
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

    performShoppingListItemUpdate(itemId, { quantity: newQuantity }, false, null, () => { setCurrentQuantity(oldQuantity) })
  }

  const decrementQuantity = () => {
    const oldQuantity = currentQuantity
    const newQuantity = currentQuantity - 1

    if (newQuantity > 0) {
      setCurrentQuantity(newQuantity)
      performShoppingListItemUpdate(itemId, { quantity: newQuantity }, false, null, () => { setCurrentQuantity(oldQuantity) })
    } else if (newQuantity === 0) {
      const confirmed = window.confirm("Item quantity must be greater than zero. Delete the item instead?")

      if (confirmed) {
        performShoppingListItemDestroy(itemId, () => { mountedRef.current = false })
      } else {
        setFlashProps({
          type: 'info', message: 'Your item was not deleted.'
        })
        setFlashVisible(true)
      }
    }
  }

  const destroyItem = () => {
    const confirmed = window.confirm("Destroy shopping list item? Your master list will be updated to reflect the change. This action cannot be undone.")

    if (confirmed) {
      performShoppingListItemDestroy(itemId, () => { mountedRef.current = false })
    } else {
      setFlashProps({
        type: 'info', message: 'Your item was not deleted'
      })
      setFlashVisible(true)
    }
  }

  const showEditForm = () => {
    setFlashVisible(false)
    setListItemEditFormProps({
      listTitle: listTitle,
      buttonColor: {
        schemeColor,
        hoverColor,
        borderColor,
        textColorPrimary
      },
      currentAttributes: {
        id: itemId,
        quantity: quantity,
        description: description,
        notes: notes,
      }
    })
    setListItemEditFormVisible(true)
  }

  useEffect(() => {
    setCurrentQuantity(quantity)
  }, [quantity])

  useEffect(() => (
    () => mountedRef.current = false
  ))

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.toggle} onClick={toggleDetails}>
        <span ref={headerRef} className={classNames(styles.header, { [styles.headerEditable]: canEdit })}>
          {canEdit &&
            <span className={styles.editIcons} ref={iconsRef}>
              <button className={styles.icon} ref={deleteRef} onClick={destroyItem}><FontAwesomeIcon className={classNames(styles.fa, styles.destroyIcon
              )} icon={faTimes} /></button>
              <button className={styles.icon} ref={editRef} onClick={showEditForm}><FontAwesomeIcon className={styles.fa} icon={faEdit} /></button>
            </span>}
          <h4 className={styles.description}>{description}</h4>
        </span>
        <span className={styles.quantity}>
          {canEdit && <button className={styles.icon} ref={incRef} onClick={incrementQuantity}>
            <FontAwesomeIcon className={styles.fa} icon={faAngleUp} />
          </button>}
          <div className={styles.quantityContent}>
            {currentQuantity}
          </div>
          {canEdit && <button className={styles.icon} ref={decRef} onClick={decrementQuantity}>
            <FontAwesomeIcon className={styles.fa} icon={faAngleDown} />
          </button>}
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
  listTitle: PropTypes.string.isRequired,
  canEdit: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  notes: PropTypes.string
}

export default ShoppingListItem
