import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faAngleUp, faAngleDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import SlideToggle from 'react-slide-toggle'
import { useAppContext, useInventoryListsContext, useColorScheme } from '../../hooks/contexts'
import withModal from '../../hocs/withModal'
import InventoryListItemEditForm from '../inventoryListItemEditForm/inventoryListItemEditForm'
import styles from './inventoryListItem.module.css'

// If the unit weight has an integer value, we want
// to display it as an integer. Only if it has a nonzero
// value in the decimal place should it be displayed as
// a decimal.
const formatWeight = weight => {
  if (weight === undefined || weight === null || weight === '') return '-'

  const weightNum = Number(weight)

  return weightNum % 1 === 0 ? weightNum.toFixed(0) : weightNum.toFixed(1)
}

const InventoryListItem = ({
  itemId,
  listTitle,
  canEdit,
  description,
  quantity,
  unitWeight,
  notes
}) => {
  const [toggleEvent, setToggleEvent] = useState(0)
  const [collapsed, setCollapsed] = useState(true)

  // This enables us to set the quantity to the new quantity during the time between when
  // the user increments/decrements the quantity and the time the API responds.
  const [currentQuantity, setCurrentQuantity] = useState(quantity)

  const {
    setFlashVisible,
    setFlashAttributes,
    setModalVisible,
    setModalAttributes
  } = useAppContext()
  const { performInventoryListItemUpdate, performInventoryListItemDestroy } = useInventoryListsContext()

  const mountedRef = useRef(true)
  const editRef = useRef(null)
  const deleteRef = useRef(null)
  const incRef = useRef(null)
  const decRef = useRef(null)

  const {
    schemeColorDarkest,
    schemeColorDark,
    hoverColorDark,
    hoverColorLight,
    textColorPrimary,
    textColorSecondary,
    borderColor,
    schemeColorLightest,
    textColorTertiary
  } = useColorScheme()

  const refContains = (ref, el) => ref.current && (ref.current === el || ref.current.contains(el))
  const iconContains = el => refContains(incRef, el) || refContains(decRef, el) || refContains(editRef, el) || refContains(deleteRef, el)

  const shouldToggleDetails = element => !iconContains(element)

  const toggleDetails = e => {
    if (shouldToggleDetails(e.target)) {
      setToggleEvent(Date.now)
      setCollapsed(!collapsed)
    }
  }

  const displayFlash = (type, message) => {
    if (!mountedRef.current) return

    setFlashAttributes({ type, message })
    setFlashVisible(true)
  }

  const styleVars = {
    '--scheme-color': schemeColorDark,
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

    performInventoryListItemUpdate(itemId, { quantity: newQuantity }, callbacks)
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
      performInventoryListItemUpdate(itemId, { quantity: newQuantity }, callbacks)
    } else if (newQuantity === 0) {
      const confirmed = window.confirm('Item quantity must be greater than zero. Delete the item instead?')

      if (confirmed) {
        const callbacks = {
          onSuccess: () => mountedRef.current = false,
          onNotFound: () => setFlashVisible(true),
          onInternalServerError: () => setFlashVisible(true)
        }

        performInventoryListItemDestroy(itemId, callbacks)
      } else {
        displayFlash('info', 'Your item was not deleted.')
      }
    }
  }

  const destroyItem = () => {
    const confirmed = window.confirm("Destroy inventory list item? Your All Items list will be updated to reflect the change. This cannot be undone.")

    if (confirmed) {
      const callbacks = {
        onSuccess: () => mountedRef.current = false,
        onUnauthorized: () => mountedRef.current = false,
        onNotFound: () => setFlashVisible(true),
        onInternalServerError: () => setFlashVisible(true)
      }

      performInventoryListItemDestroy(itemId, callbacks)
    } else {
      displayFlash('info', 'Your item was not deleted.')
    }
  }

  const showEditForm = () => {
    if (!mountedRef.current) return

    setFlashVisible(false)

    const Tag = withModal(InventoryListItemEditForm)

    setModalAttributes({
      Tag,
      props: {
        title: description,
        subtitle: `On list "${listTitle}"`,
        buttonColor: {
          schemeColorDarkest,
          hoverColorDark,
          borderColor,
          textColorPrimary
        },
        currentAttributes: {
          id: itemId,
          description,
          quantity,
          unitWeight,
          notes
        }
      }
    })

    setModalVisible(true)
  }

  useEffect(() => {
    if (mountedRef.current) setCurrentQuantity(quantity)
  }, [quantity])

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <div className={classNames(styles.root, { [styles.collapsed]: collapsed })} style={styleVars}>
      <div className={styles.toggle} onClick={toggleDetails}>
        <span className={classNames(styles.header, { [styles.headerEditable]: canEdit })}>
          {canEdit &&
          <span className={styles.editIcons}>
            <button className={styles.icon} ref={deleteRef} onClick={destroyItem} data-testid='destroy-item'>
              <FontAwesomeIcon className={classNames(styles.fa, styles.destroyIcon)} icon={faTimes} />
            </button>
            <button className={styles.icon} ref={editRef} onClick={showEditForm} data-testid='edit-item'>
              <FontAwesomeIcon className={styles.fa} icon={faEdit} />
            </button>
          </span>}
          <h3 className={styles.description}>{description}</h3>
        </span>
        <span className={styles.quantity}>
          {canEdit && <button className={styles.icon} ref={incRef} onClick={incrementQuantity} data-testid='incrementer'>
            <FontAwesomeIcon className={styles.fa} icon={faAngleUp} />
          </button>}
          <div className={styles.quantityContent}>{currentQuantity}</div>
          {canEdit && <button className={styles.icon} ref={decRef} onClick={decrementQuantity} data-testid='decrementer'>
            <FontAwesomeIcon className={styles.fa} icon={faAngleDown} />
          </button>}
        </span>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            <h4 className={styles.label}>Unit Weight:</h4>
            <p className={styles.value}>{formatWeight(unitWeight)}</p>

            <h4 className={styles.label}>Notes:</h4>
            <p className={styles.value}>{notes || 'No details available'}</p>
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

InventoryListItem.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  itemId: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  listTitle: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  notes: PropTypes.string,
  unitWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default InventoryListItem
