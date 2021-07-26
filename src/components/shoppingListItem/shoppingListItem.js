import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faAngleUp, faAngleDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useAppContext, useColorScheme, useShoppingListsContext } from '../../hooks/contexts'
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
    setFlashProps,
    setFlashVisible
  } = useAppContext()

  const {
    schemeColorDarkest,
    textColorPrimary,
    hoverColorDark,
    schemeColorDark,
    hoverColorLight,
    textColorSecondary,
    borderColor,
    schemeColorLightest,
    textColorTertiary
  } = useColorScheme()

  const {
    performShoppingListItemUpdate,
    performShoppingListItemDestroy,
    setListItemEditFormProps,
    setListItemEditFormVisible
  } = useShoppingListsContext()

  const mountedRef = useRef(true)
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
    if (!iconContains(e.target)) setToggleEvent(Date.now)
  }

  const displayFlash = (type, message, header = null) => {
    if (mountedRef.current) {
      setFlashProps({ type, message, header })
      setFlashVisible(true)
    }
  }

  const styleVars = {
    '--main-color': schemeColorDark,
    '--title-text-color': textColorSecondary,
    '--border-color': borderColor,
    '--body-background-color': schemeColorLightest,
    '--body-text-color': textColorTertiary,
    '--hover-color': hoverColorLight
  }

  const incrementQuantity = () => {
    const oldQuantity = currentQuantity
    const newQuantity = currentQuantity + 1

    if (mountedRef.current) setCurrentQuantity(newQuantity)

    const callbacks = {
      onNotFound: () => {
        setCurrentQuantity(oldQuantity)
        setFlashVisible(true)
      },
      onInternalServerError: () => {
        setCurrentQuantity(oldQuantity)
        setFlashVisible(true)
      }
    }

    performShoppingListItemUpdate(itemId, { quantity: newQuantity }, callbacks)
  }

  const decrementQuantity = () => {
    const oldQuantity = currentQuantity
    const newQuantity = currentQuantity - 1

    if (newQuantity > 0) {
      const callbacks = {
        onNotFound: () => {
          setCurrentQuantity(oldQuantity)
          setFlashVisible(true)
        },
        onInternalServerError: () => {
          setCurrentQuantity(oldQuantity)
          setFlashVisible(true)
        }
      }

      setCurrentQuantity(newQuantity)
      performShoppingListItemUpdate(itemId, { quantity: newQuantity }, callbacks)
    } else if (newQuantity === 0) {
      const confirmed = window.confirm("Item quantity must be greater than zero. Delete the item instead?")

      if (confirmed) {
        performShoppingListItemDestroy(itemId, () => { mountedRef.current = false })
      } else {
        displayFlash('info', 'Your item was not deleted.')
      }
    }
  }

  const destroyItem = () => {
    const confirmed = window.confirm("Destroy shopping list item? Your aggregate list will be updated to reflect the change. This action cannot be undone.")

    if (confirmed) {
      performShoppingListItemDestroy(itemId, () => { mountedRef.current = false })
    } else {
      displayFlash('info', 'Your item was not deleted.')
    }
  }

  const showEditForm = () => {
    if (mountedRef.current) {
      setFlashVisible(false)

      setListItemEditFormProps({
        listTitle: listTitle,
        buttonColor: {
          schemeColorDarkest,
          hoverColorDark,
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
  }

  useEffect(() => {
    if (mountedRef.current) setCurrentQuantity(quantity)
  }, [quantity])

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.toggle} onClick={toggleDetails}>
        <span className={classNames(styles.header, { [styles.headerEditable]: canEdit })}>
          {canEdit &&
            <span className={styles.editIcons} ref={iconsRef}>
              <button className={styles.icon} ref={deleteRef} onClick={destroyItem}>
                <FontAwesomeIcon className={classNames(styles.fa, styles.destroyIcon)} icon={faTimes} />
              </button>
              <button className={styles.icon} ref={editRef} onClick={showEditForm} data-testid='edit-item'>
                <FontAwesomeIcon className={styles.fa} icon={faEdit} />
              </button>
            </span>}
          <h4 className={styles.description}>{description}</h4>
        </span>
        <span className={styles.quantity}>
          {canEdit && <button className={styles.icon} ref={incRef} onClick={incrementQuantity} data-testid='incrementer'>
            <FontAwesomeIcon className={styles.fa} icon={faAngleUp} />
          </button>}
          <div className={styles.quantityContent}>
            {currentQuantity}
          </div>
          {canEdit && <button className={styles.icon} ref={decRef} onClick={decrementQuantity} data-testid='decrementer'>
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
