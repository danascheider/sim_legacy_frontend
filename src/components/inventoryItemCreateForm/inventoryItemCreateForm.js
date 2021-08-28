import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SlideToggle from 'react-slide-toggle'
import { useAppContext, useColorScheme, useInventoryListsContext } from '../../hooks/contexts'
import styles from './inventoryItemCreateForm.module.css'

const InventoryItemCreateForm = ({ listId }) => {
  const [toggleEvent, setToggleEvent] = useState(0)
  const [collapsed, setCollapsed] = useState(true)
  const { setFlashVisible } = useAppContext()
  const { performInventoryItemCreate } = useInventoryListsContext()
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

  const toggleForm = () => {
    setToggleEvent(Date.now)
    setCollapsed(!collapsed)
  }

  const createInventoryListItem = e => {
    e.preventDefault()

    setFlashVisible(false)

    let unit_weight = e.target.elements.unitWeight.value
    
    if (unit_weight === undefined || unit_weight === null || unit_weight === '') {
      unit_weight = null
    } else {
      unit_weight = Number(unit_weight)
    }

    const description = e.target.elements.description.value
    const quantity = parseInt(e.target.elements.quantity.value)
    const notes = e.target.elements.notes.value
    const attrs = { description, quantity, unit_weight, notes }

    const resetToggleAndDisplayFlash = () => {
      formRef.current.reset()
      toggleForm()
      setFlashVisible(true)
    }

    const callbacks = {
      onSuccess: resetToggleAndDisplayFlash,
      onNotFound: resetToggleAndDisplayFlash,
      onUnprocessableEntity: () => setFlashVisible(true),
      onInternalServerError: resetToggleAndDisplayFlash
    }

    performInventoryItemCreate(listId, attrs, callbacks)
  }

  return(
    <div className={classNames(styles.root, { [styles.collapsed]: collapsed })} style={colorVars}>
      <div className={styles.triggerContainer}>
        <button className={styles.triggerButton} onClick={toggleForm}>
          Add item to list...
        </button>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            <form className={styles.form} ref={formRef} onSubmit={createInventoryListItem}>
              <fieldset className={styles.fieldset}>
                <label className={styles.label}>Description</label>
                <input className={styles.input} type='text' name='description' placeholder='Description' required />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <label className={styles.label}>Quantity</label>
                <input className={styles.input} type='number' inputMode='numeric' min={1} name='quantity' defaultValue={1} required />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <label className={styles.label}>Unit Weight</label>
                <input className={styles.input} type='number' inputMode='numeric' min={0} step={0.1} name='unitWeight' placeholder='Unit Weight' />
              </fieldset>

              <fieldset className={styles.fieldset}>
                <label className={styles.label}>Notes</label>
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

InventoryItemCreateForm.propTypes = {
  listId: PropTypes.number.isRequired
}

export default InventoryItemCreateForm
