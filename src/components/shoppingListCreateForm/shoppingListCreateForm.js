import React from 'react'
import styles from './shoppingListCreateForm.module.css'

const ShoppingListCreateForm = () => {
  // const { createShoppingList } = useShoppingListContext()
  const createShoppingList = () => {}

  return(
    <div className={styles.root}>
      <form className={styles.form} onSubmit={createShoppingList}>
        <input type='text' name='title' placeholder='Title' />
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default ShoppingListCreateForm
