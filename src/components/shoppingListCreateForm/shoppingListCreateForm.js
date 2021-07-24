import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BLUE } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext, useShoppingListsContext } from '../../hooks/contexts'
import useQuery from '../../hooks/useQuery'
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
    const callbacks = {
      onSuccess: () => setInputValue(''),
      onNotFound: () => setFlashVisible(true),
      onUnprocessableEntity: () => setFlashVisible(true),
      onInternalServerError: () => setFlashVisible(true)
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
