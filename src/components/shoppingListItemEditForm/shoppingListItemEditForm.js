import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useAppContext, useShoppingListsContext } from '../../hooks/contexts'
import styles from './shoppingListItemEditForm.module.css'

const ShoppingListItemEditForm = ({ buttonColor, currentAttributes }) => {
  const { setFlashVisible } = useAppContext()
  const { performShoppingListItemUpdate, setListItemEditFormVisible } = useShoppingListsContext()

  const mountedRef = useRef(true)
  const formRef = useRef(null)
  const inputRef = useRef(null)

  const colorVars = {
    '--button-background-color': buttonColor.schemeColorDarkest,
    '--button-text-color': buttonColor.textColorPrimary,
    '--button-hover-color': buttonColor.hoverColorDark,
    '--button-border-color': buttonColor.borderColor
  }

  const updateItem = e => {
    e.preventDefault()

    const onError = () => {
      setFlashVisible(true)
      setListItemEditFormVisible(false)
      mountedRef.current = false
    }

    const callbacks = {
      onSuccess: () => setFlashVisible(true),
      onNotFound: onError,
      onUnprocessableEntity: onError,
      onInternalServerError: onError,
      onUnauthorized: () => mountedRef.current = false
    }

    const quantity = e.target.elements.quantity.value
    const notes = e.target.elements.notes.value

    performShoppingListItemUpdate(currentAttributes.id, { quantity, notes }, callbacks)
  }

  useEffect(() => {
    inputRef.current && inputRef.current.focus()

    return () => mountedRef.current = false
  }, [])

  return(
    <form
      ref={formRef}
      className={styles.root}
      style={colorVars}
      onSubmit={updateItem}
      data-testid='shopping-list-item-edit-form'
    >
      <fieldset className={styles.fieldset}>
        <label className={styles.quantityLabel} htmlFor='quantity'>Quantity</label>
        <input
          className={styles.input}
          ref={inputRef}
          type='number'
          inputMode='numeric'
          name='quantity'
          defaultValue={currentAttributes.quantity}
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <label className={styles.notesLabel} htmlFor='notes'>Notes</label>
        <textarea
          className={styles.input}
          type='text'
          name='notes'
          placeholder='This item has no notes'
          defaultValue={currentAttributes.notes}
        />
      </fieldset>
      <button className={styles.submit}>Update Item</button>
    </form>
  )
}

ShoppingListItemEditForm.propTypes = {
  buttonColor: PropTypes.shape({
    schemeColorDarkest: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    hoverColorDark: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired
  }).isRequired,
  currentAttributes: PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    notes: PropTypes.string
  }).isRequired
}

export default ShoppingListItemEditForm
