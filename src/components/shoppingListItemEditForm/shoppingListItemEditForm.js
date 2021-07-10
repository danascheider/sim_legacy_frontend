import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useShoppingListContext } from '../../hooks/contexts'
import styles from './shoppingListItemEditForm.module.css'

const ShoppingListItemEditForm = ({ listTitle, elementRef, buttonColor, currentAttributes }) => {
  const {
    performShoppingListItemUpdate
  } = useShoppingListContext()

  const mountedRef = useRef(true)
  const formRef = useRef(null)
  const inputRef = useRef(null)

  const colorVars = {
    '--button-background-color': buttonColor.schemeColor,
    '--button-text-color': buttonColor.textColorPrimary,
    '--button-hover-color': buttonColor.hoverColor,
    '--button-border-color': buttonColor.borderColor
  }

  const updateItem = (e) => {
    e.preventDefault()

    const quantity = e.target.elements.quantity.value
    const notes = e.target.elements.notes.value

    performShoppingListItemUpdate(currentAttributes.id, { quantity, notes }, true, () => {
      mountedRef.current = false
      if (formRef.current) formRef.current.reset()
    })
  }

  useEffect(() => {
    inputRef && inputRef.current.focus()
  }, [])

  return(
    <div ref={elementRef} className={styles.root} style={colorVars}>
      <h4 className={styles.header}>{currentAttributes.description}</h4>
      <p className={styles.subheader}>{`On list "${listTitle}"`}</p>
      <form className={styles.form} ref={formRef} onSubmit={updateItem}>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor='quantity'>Quantity</label>
          <input className={styles.input} ref={inputRef} type='text' name='quantity' defaultValue={currentAttributes.quantity} />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor='notes'>Notes</label>
          <input className={styles.input} type='text' name='notes' defaultValue={currentAttributes.notes} />
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
    schemeColor: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
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