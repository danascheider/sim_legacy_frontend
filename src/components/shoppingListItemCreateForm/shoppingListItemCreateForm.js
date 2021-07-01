import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import { useColorScheme } from '../../hooks/contexts'
import styles from './shoppingListItemCreateForm.module.css'

const ShoppingListItemCreateForm = ({ listId }) => {
  const [toggleEvent, setToggleEvent] = useState(0)
  const {
    schemeColorLighter,
    hoverColorLighter,
    schemeColorLightest,
    borderColor,
    textColorSecondary,
    textColorTertiary
  } = useColorScheme()

  const colorVars = {
    '--base-color': schemeColorLighter,
    '--hover-color': hoverColorLighter,
    '--body-color': schemeColorLightest,
    '--border-color': borderColor,
    '--text-color-main': textColorSecondary,
    '--text-color-secondary': textColorTertiary
  }

  const toggleForm = () => {
    setToggleEvent(Date.now)
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
            <form className={styles.form}>
              <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor='description'>Description</label>
                <input className={styles.input} type='text' name='description' placeholder='Description' />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor='quantity'>Quantity</label>
                <input className={styles.input} type='text' name='quantity' placeholder='Quantity' />
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
