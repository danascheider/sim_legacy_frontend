import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BLUE } from '../../utils/colorSchemes'
import { useAppContext, useShoppingListsContext } from '../../hooks/contexts'
import styles from './shoppingListCreateForm.module.css'

const ShoppingListCreateForm = ({ disabled }) => {
  const { setFlashVisible } = useAppContext()

  const { performShoppingListCreate } = useShoppingListsContext()

  const [inputValue, setInputValue] = useState('')

  const colorVars = {
    '--button-color': BLUE.schemeColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLight,
  }

  const updateValue = e => {
    const newValue = e.currentTarget.value
    setInputValue(newValue)
  }

  const createShoppingList = e => {
    e.preventDefault()
    setFlashVisible(false)
    const title = e.target.elements.title.value

    const showFlashAndClearInput = () => {
      setInputValue('')
      setFlashVisible(true)
    }

    const callbacks = {
      onSuccess: () => setInputValue(''),
      onNotFound: showFlashAndClearInput,
      onUnprocessableEntity: () => setFlashVisible(true),
      onInternalServerError: showFlashAndClearInput
    }
    performShoppingListCreate(title, callbacks)
  }

  return(
    <div className={styles.root} style={colorVars}>
      <form data-testid='shopping-list-create-form' onSubmit={createShoppingList}>
        <fieldset className={classNames(styles.fieldset, { [styles.fieldsetDisabled]: disabled })} disabled={disabled}>
          <input
            className={styles.input}
            type='text'
            name='title'
            placeholder='Title'
            aria-label='Title'
            value={inputValue}
            onChange={updateValue}
            pattern="^\s*[A-Za-z0-9 \-',]*\s*$"
            title='Title can only contain alphanumeric characters, spaces, commas, hyphens, and apostrophes'
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
