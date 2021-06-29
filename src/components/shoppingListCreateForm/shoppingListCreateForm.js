import React, { useState } from 'react'
import { BLUE } from '../../utils/colorSchemes'
import { useShoppingListContext } from '../../hooks/contexts'
import styles from './shoppingListCreateForm.module.css'

const ShoppingListCreateForm = () => {
  const { performShoppingListCreate } = useShoppingListContext()
  const [inputValue, setInputValue] = useState('')

  const colorVars = {
    '--button-color': BLUE.schemeColorLighter,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLighter
  }

  const updateValue = e => {
    const newValue = e.currentTarget.value
    setInputValue(newValue)
  }

  const createShoppingList = e => {
    e.preventDefault()
    const title = e.nativeEvent.target.children[0].defaultValue
    performShoppingListCreate(title, () => setInputValue(''))
  }

  return(
    <div className={styles.root} style={colorVars}>
      <form className={styles.form} onSubmit={createShoppingList}>
        <input
          className={styles.input}
          type='text'
          name='title'
          placeholder='Title'
          value={inputValue}
          onChange={updateValue}
        />
        <button className={styles.button} type='submit'>Create</button>
      </form>
    </div>
  )
}

export default ShoppingListCreateForm
