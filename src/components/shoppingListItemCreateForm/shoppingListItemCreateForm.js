import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import { useAppContext, useColorScheme, useShoppingListsContext } from '../../hooks/contexts'
import styles from './shoppingListItemCreateForm.module.css'

const ShoppingListItemCreateForm = ({ listId }) => {
  const [toggleEvent, setToggleEvent] = useState(0)
  const { setFlashVisible } = useAppContext()
  const { performShoppingListItemCreate } = useShoppingListsContext()
  const {
    schemeColorDark,
    hoverColorLight,
    schemeColorLightest,
    borderColor,
    textColorSecondary,
    textColorTertiary
  } = useColorScheme()

  const formRef = useRef(null)

  const colorVars = {
    '--base-color': schemeColorDark,
    '--hover-color': hoverColorLight,
    '--body-color': schemeColorLightest,
    '--border-color': borderColor,
    '--text-color-main': textColorSecondary,
    '--text-color-secondary': textColorTertiary
  }

  const toggleForm = () => setToggleEvent(Date.now)

  const createShoppingListItem = e => {
    e.preventDefault()

    setFlashVisible(false)

    const description = e.target.elements.description.value
    const quantity = parseInt(e.target.elements.quantity.value)
    const notes = e.target.elements.notes.value
    const attrs = { description, quantity, notes }

    const callbacks = {
      onSuccess: () => {
        formRef.current.reset()
        toggleForm()
      },
      onNotFound: () => {
        formRef.current.reset()
        toggleForm()
        setFlashVisible(true)
      },
      onUnprocessableEntity: () => setFlashVisible(true)
    }

    performShoppingListItemCreate(listId, attrs, callbacks)
  }

  return(
    <div className={styles.root} style={colorVars}>
      <div className={styles.triggerContainer}>
        <button className={styles.triggerButton} onClick={toggleForm}>
          Add item to list...
        </button>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            <form className={styles.form} ref={formRef} onSubmit={createShoppingListItem}>
              <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor='description'>Description</label>
                <input className={styles.input} type='text' name='description' placeholder='Description' />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor='quantity'>Quantity</label>
                <input className={styles.input} type='number' inputMode='numeric' name='quantity' defaultValue={1} />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor='notes'>Notes</label>
                <input className={styles.input} type='text' name='notes' placeholder='Notes' />
              </fieldset>

              <button className={styles.submit} type='submit'>Add to List</button>
            </form>
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

ShoppingListItemCreateForm.propTypes = {
  listId: PropTypes.number.isRequired
}

export default ShoppingListItemCreateForm
