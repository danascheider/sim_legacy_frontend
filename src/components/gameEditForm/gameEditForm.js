import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import colorSchemes from '../../utils/colorSchemes'
import { useGamesContext } from '../../hooks/contexts'
import styles from './gameEditForm.module.css'

const GameEditForm = ({ gameId, elementRef, currentAttributes }) => {
  const { name, description } = currentAttributes

  const { performGameUpdate } = useGamesContext()

  const mountedRef = useRef(true)
  const formRef = useRef(null)
  const inputRef = useRef(null)
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

    const callbacks = {
      onSuccess: resetAndUnmount,
      onNotFound: resetAndUnmount,
      onInternalServerError: resetAndUnmount,
      onUnauthorized: resetAndUnmount
    }

    performGameUpdate(gameId, attrs, callbacks)
  }

  useEffect(() => {
    document.getElementsByTagName('body')[0].classList.add('modal-open')
    inputRef && inputRef.current.focus()

    return () => {
      document.getElementsByTagName('body')[0].classList.remove('modal-open')
      mountedRef.current = false
    }
  }, [])

  return(
    <div ref={elementRef} className={styles.root} style={colorVars}>
      <h3 className={styles.header}>Edit Game</h3>
      <form ref={formRef} className={styles.form} onSubmit={updateGame} data-testid='game-edit-form'>
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
    </div>
  )
}

GameEditForm.propTypes = {
  gameId: PropTypes.number.isRequired,
  elementRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  currentAttributes: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired
}

export default GameEditForm
