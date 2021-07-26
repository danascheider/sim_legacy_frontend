import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useAppContext, useShoppingListsContext } from '../../hooks/contexts'
import styles from './shoppingListItemEditForm.module.css'

const ShoppingListItemEditForm = ({ listTitle, elementRef, buttonColor, currentAttributes }) => {
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

    const quantity = e.target.elements.quantity.value
    const notes = e.target.elements.notes.value

    const callbacks = {
      onSuccess: () => setFlashVisible(true),
      onNotFound: () => {
        setFlashVisible(true)
        mountedRef.current = false
        setListItemEditFormVisible(false)
      }
    }

    performShoppingListItemUpdate(currentAttributes.id, { quantity, notes }, callbacks)
  }

  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('modal-open')
    inputRef && inputRef.current.focus()

    return () => {
      document.getElementsByTagName('body')[0].classList.remove('modal-open')
    }
  }, [])

  return(
    <div ref={elementRef} className={styles.root} style={colorVars}>
      <h4 className={styles.header}>{currentAttributes.description}</h4>
      <p className={styles.subheader}>{`On list "${listTitle}"`}</p>
      <form className={styles.form} ref={formRef} onSubmit={updateItem} data-testid='shopping-list-item-edit-form'>
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
    </div>
  )
}

ShoppingListItemEditForm.propTypes = {
  elementRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  listTitle: PropTypes.string.isRequired,
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
