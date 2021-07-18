import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SlideToggle from 'react-slide-toggle'
import { BLUE } from '../../utils/colorSchemes'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import styles from './gameCreateForm.module.css'

const GameCreateForm = ({ disabled }) => {
  const { hideFlash } = useAppContext()
  const { performGameCreate } = useGamesContext()

  const [toggleEvent, setToggleEvent] = useState(0)

  const colorVars = {
    '--button-color': BLUE.schemeColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor,
    '--button-hover-color': BLUE.hoverColorLight,
  }

  const toggleForm = () => setToggleEvent(Date.now)

  const createGame = e => {
    e.preventDefault()
    hideFlash()

    const attrs = {
      name: e.target.elements.name.value,
      description: e.target.elements.description.value
    }

    performGameCreate(attrs)
  }

  return(
    <div className={styles.root} style={colorVars}>
      <p className={styles.slideToggleTrigger} onClick={toggleForm}>Create Game...</p>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <form ref={setCollapsibleElement} className={styles.form} onSubmit={createGame}>
            <fieldset className={classNames(styles.fieldset, { [styles.fieldsetDisabled]: disabled })} disabled={disabled}>
              <label htmlFor='name' className={styles.label}>Name</label>
              <input
                className={styles.input}
                type='text'
                name='name'
                placeholder='Name'
              />
            </fieldset>
            <fieldset className={classNames(styles.fieldset, { [styles.fieldsetDisabled]: disabled })} disabled={disabled}>
              <label htmlFor='name' className={styles.label}>Description</label>
              <input
                className={styles.input}
                type='text'
                name='description'
                placeholder='Description'
              />
            </fieldset>
            <button className={classNames(styles.button, { [styles.buttonDisabled]: disabled })} type='submit' disabled={disabled}>
              Create
            </button>
          </form>
        )}
      </SlideToggle>
    </div>
  )
}

GameCreateForm.propTypes = {
  disabled: PropTypes.bool.isRequired
}

export default GameCreateForm
