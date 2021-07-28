import React, { useEffect, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import colorSchemes from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import styles from './gameEditForm.module.css'

const GameEditForm = forwardRef(({ gameId, currentAttributes }, ref) => {
  const { name, description } = currentAttributes

  const { setFlashVisible } = useAppContext()
  const { performGameUpdate } = useGamesContext()

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

  const updateGame = e => {
    e.preventDefault()

    const newName = e.target.elements.name.value
    const newDesc = e.target.elements.description.value

    const attrs = { name: newName, description: newDesc }

    const resetAndUnmount = () => {
      if (formRef.current) formRef.current.reset()
      mountedRef.current = false
    }

    const resetUnmountAndDisplayFlash = () => {
      setFlashVisible(true)
      resetAndUnmount()
    }

    const callbacks = {
      onSuccess: resetUnmountAndDisplayFlash,
      onNotFound: resetUnmountAndDisplayFlash,
      onInternalServerError: resetUnmountAndDisplayFlash,
      onUnauthorized: resetAndUnmount,
      onUnprocessableEntity: resetUnmountAndDisplayFlash
    }

    performGameUpdate(gameId, attrs, callbacks)
  }

  useEffect(() => {
    inputRef.current && inputRef.current.focus()

    return () => mountedRef.current = false
  }, [])

  return(
    <form
      ref={formRef}
      className={styles.root}
      style={colorVars}
      onSubmit={updateGame}
      data-testid='game-edit-form'
    >
      <fieldset className={styles.fieldset}>
        <label className={styles.label} htmlFor='editGameName'>Name</label>
        <input
          id='editGameName'
          ref={inputRef}
          className={styles.input}
          name='name'
          type='text'
          defaultValue={name}
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <label className={styles.label} htmlFor='editGameDescription'>Description</label>
        <input
          id='editGameDescription'
          className={styles.input}
          type='text'
          name='description'
          defaultValue={description}
          placeholder='Description'
        />
      </fieldset>
      <button className={styles.submit}>Update Game</button>
    </form>
  )
})

GameEditForm.propTypes = {
  gameId: PropTypes.number.isRequired,
  currentAttributes: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired
}

export default GameEditForm
