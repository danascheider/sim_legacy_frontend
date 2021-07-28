import React, { useEffect, useRef } from 'react'
import colorSchemes from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import styles from './modalGameCreateForm.module.css'

const ModalGameCreateForm = () => {
  const { setFlashVisible } = useAppContext()
  const { performGameCreate } = useGamesContext()

  const mountedRef = useRef(true)
  const formRef = useRef(null)
  const inputRef = useRef(null)

  // Make the button a random color
  const colorRef = useRef(colorSchemes[Math.floor(Math.random() * colorSchemes.length)])
  const colorVars = {
    '--button-background-color': colorRef.current.schemeColorDarkest,
    '--button-text-color': colorRef.current.textColorPrimary,
    '--button-hover-color': colorRef.current.hoverColorDark,
    '--button-border-color': colorRef.current.borderColor
  }

  const createGame = e => e.preventDefault()

  useEffect(() => {
    inputRef.current && inputRef.current.focus()

    return () => mountedRef.current = false
  })

  return(
    <form
      ref={formRef}
      className={styles.root}
      style={colorVars}
      onSubmit={createGame}
      data-testid='modal-game-create-form'
    >
      <fieldset className={styles.fieldset}>
        <label className={styles.label} htmlFor='newGameName'>Name</label>
        <input
          id='newGameName'
          ref={inputRef}
          className={styles.input}
          name='name'
          type='text'
          placeholder='Name'
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <label className={styles.label} htmlFor='newGameDescription'>Description</label>
        <input
          id='newGameDescription'
          className={styles.input}
          type='text'
          name='description'
          placeholder='Description'
        />
      </fieldset>
      <button className={styles.submit}>Create Game</button>
    </form>
  )
}

export default ModalGameCreateForm
