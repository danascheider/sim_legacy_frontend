import React, { useState } from 'react'
import { useShoppingListContext } from '../../hooks/contexts'
import styles from './shoppingListCreateForm.module.css'

const ShoppingListCreateForm = () => {
  const { performShoppingListCreate } = useShoppingListContext()
  const [inputValue, setInputValue] = useState('')

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
    <form className={styles.root} onSubmit={createShoppingList}>
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
  )
}

export default ShoppingListCreateForm
