import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { BLUE } from '../../utils/colorSchemes'
import { useShoppingListContext } from '../../hooks/contexts'
import styles from './shoppingListCreateForm.module.css'
import classNames from 'classnames'

const ShoppingListCreateForm = ({ disabled }) => {
  const {
    performShoppingListCreate,
    setFlashVisible
  } = useShoppingListContext()

  const [inputValue, setInputValue] = useState('')

  const colorVars = {
    '--button-color': BLUE.schemeColorLighter,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLighter,
  }

  const updateValue = e => {
    const newValue = e.currentTarget.value
    setInputValue(newValue)
  }

  const createShoppingList = e => {
    e.preventDefault()
    setFlashVisible(false)
    const title = e.target.elements.title.value
    performShoppingListCreate(title, () => setInputValue(''))
  }

  return(
    <div className={styles.root} style={colorVars}>
      <form className={styles.form} onSubmit={createShoppingList}>
        <fieldset className={classNames(styles.fieldset, { [styles.fieldsetDisabled]: disabled })} disabled={disabled}>
          <input
            className={styles.input}
            type='text'
            name='title'
            placeholder='Title'
            value={inputValue}
            onChange={updateValue}
          />
          <button className={classNames(styles.button, { [styles.buttonDisabled]: disabled })} type='submit'>Create</button>
        </fieldset>
      </form>
    </div>
  )
}

ShoppingListCreateForm.propTypes = {
  disabled: PropTypes.bool.isRequired
}

export default ShoppingListCreateForm
