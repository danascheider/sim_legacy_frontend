import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import colorSchemes from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import styles from './modalGameForm.module.css'

const randomColor = colorSchemes[Math.floor(Math.random() * colorSchemes.length)]

const ModalGameForm = ({ type, buttonColor = randomColor, currentAttributes = {} }) => {
  const { setFlashVisible } = useAppContext()
  const { performGameCreate, performGameUpdate } = useGamesContext()

  const mountedRef = useRef(true)
  const formRef = useRef(null)
  const inputRef = useRef(null)

  const colorVars = {
    '--button-background-color': buttonColor.schemeColorDarkest,
    '--button-text-color': buttonColor.textColorPrimary,
    '--button-hover-color': buttonColor.hoverColorDark,
    '--button-border-color': buttonColor.borderColor
  }

  const buttonLabel = type === 'create' ? 'Create Game' : 'Update Game'

  const onSubmit = e => {
    e.preventDefault()

    setFlashVisible(false)

    const resetUnmountAndDisplayFlash = () => {
      setFlashVisible(true)
      formRef.current && formRef.current.reset()
      mountedRef.current = false
    }

    const callbacks = {
      onSuccess: resetUnmountAndDisplayFlash,
      onUnprocessableEntity: resetUnmountAndDisplayFlash,
      onInternalServerError: resetUnmountAndDisplayFlash,
      onNotFound: resetUnmountAndDisplayFlash, // only valid for update but won't break anything
      onUnauthorized: () => mountedRef.current = false
    }

    const attrs = {
      name: e.target.elements.name.value,
      description: e.target.elements.description.value
    }

    for (const attr in attrs) {
      if (!attrs[attr] === currentAttributes[attr]) delete attrs[attr]
    }

    if (type === 'create') {
      performGameCreate(attrs, callbacks)
    } else {
      performGameUpdate(currentAttributes.id, attrs, callbacks)
    }
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
      onSubmit={onSubmit}
      data-testid='game-form'
    >
      <fieldset className={styles.fieldset}>
        <label className={styles.label} htmlFor='gameName'>Name</label>
        <input
          id='gameName'
          ref={inputRef}
          className={styles.input}
          name='name'
          type='text'
          placeholder='Name'
          defaultValue={currentAttributes.name}
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <label className={styles.label} htmlFor='gameDescription'>Description</label>
        <input
          id='gameDescription'
          className={styles.input}
          name='description'
          type='text'
          placeholder='Description'
          defaultValue={currentAttributes.description}
        />
      </fieldset>
      <button className={styles.submit}>{buttonLabel}</button>
    </form>
  )  
}

ModalGameForm.propTypes = {
  type: PropTypes.oneOf(['create', 'edit']).isRequired,
  buttonColor: PropTypes.shape({
    schemeColorDarkest: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    hoverColorDark: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired
  }),
  currentAttributes: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  })
}

export default ModalGameForm
