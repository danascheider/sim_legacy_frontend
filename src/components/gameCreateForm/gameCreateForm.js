import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SlideToggle from 'react-slide-toggle'
import { BLUE } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import styles from './gameCreateForm.module.css'

const GameCreateForm = ({ disabled }) => {
  const { setFlashVisible } = useAppContext()
  const { performGameCreate } = useGamesContext()

  const [toggleEvent, setToggleEvent] = useState(0)

  const formRef = useRef(null)
  const inputRef = useRef(null)
  const mountedRef = useRef(true)

  const colorVars = {
    '--button-color': BLUE.schemeColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLight,
  }

  const toggleForm = () => mountedRef.current && setToggleEvent(Date.now)

  const createGame = e => {
    e.preventDefault()

    setFlashVisible(false)

    const attrs = {
      name: e.target.elements.name.value,
      description: e.target.elements.description.value
    }

    const onSuccessOrFatalError = () => {
      setFlashVisible(true)
      formRef.current && formRef.current.reset()
      toggleForm()
    }

    const callbacks = {
      onSuccess: onSuccessOrFatalError,
      onUnprocessableEntity: () => setFlashVisible(true),
      onInternalServerError: onSuccessOrFatalError,
      onUnauthorized: () => mountedRef.current = false
    }

    performGameCreate(attrs, callbacks)
  }

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <div className={styles.root} style={colorVars}>
      <h3 className={styles.slideToggleTrigger} onClick={toggleForm}>Create Game...</h3>
      <SlideToggle toggleEvent={toggleEvent} onExpanded={() => inputRef.current.focus()} collapsed>
        {({ setCollapsibleElement }) => (
          /* Include this div so we can set the form ref to something else */
          <div ref={setCollapsibleElement}>
            {/* Unfortunately, setting data-testid seems the only way to test this since fireEvent.click on the button doesn't work */}
            <form ref={formRef} className={styles.form} data-testid='game-create-form' onSubmit={createGame}>
              <fieldset className={classNames(styles.fieldset, { [styles.fieldsetDisabled]: disabled })} disabled={disabled}>
                <input
                  ref={inputRef}
                  className={styles.input}
                  type='text'
                  name='name'
                  placeholder='Name'
                  aria-label='Name'
                  pattern="\s*[A-Za-z0-9 \-',]*\s*"
                  title="Name can contain only alphanumeric characters, spaces, commas, hyphens, and apostrophes"
                  required
                />
              </fieldset>
              <fieldset className={classNames(styles.fieldset, { [styles.fieldsetDisabled]: disabled })} disabled={disabled}>
                <input
                  className={styles.input}
                  type='text'
                  name='description'
                  placeholder='Description'
                  aria-label='Description'
                />
              </fieldset>
              <button className={classNames(styles.button, { [styles.buttonDisabled]: disabled })} type='submit' disabled={disabled}>
                Create
              </button>
            </form>
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

GameCreateForm.propTypes = {
  disabled: PropTypes.bool.isRequired
}

export default GameCreateForm
