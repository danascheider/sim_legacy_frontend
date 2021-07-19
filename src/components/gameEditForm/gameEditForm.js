import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import colorSchemes from '../../utils/colorSchemes'
import { useGamesContext } from '../../hooks/contexts'
import styles from './gameEditForm.module.css'

const GameEditForm = ({ gameId, elementRef, currentAttributes }) => {
  const { name, description } = currentAttributes

  const formRef = useRef(null)
  const inputRef = useRef(null)
  const colorRef = useRef(colorSchemes[Math.floor(Math.random() * colorSchemes.length)])

  const colorVars = {
    '--button-background-color': colorRef.current.schemeColorDarkest,
    '--button-text-color': colorRef.current.textColorPrimary,
    '--button-hover-color': colorRef.current.hoverColorDark,
    '--button-border-color': colorRef.current.borderColor
  }

  const updateGame = e => {}

  return(
    <div ref={elementRef} className={styles.root} style={colorVars}>
      <h3 className={styles.header}>Edit Game</h3>
      <form ref={formRef} className={styles.form} onSubmit={updateGame} data-testid='game-edit-form'>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor='name'>Name</label>
          <input
            ref={inputRef}
            className={styles.input}
            type='text'
            name='name'
            defaultValue={name}
          />
        </fieldset>
        <fieldset className={styles.fieldset}>
          <label className={styles.label} htmlFor='description'>Description</label>
          <input
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
