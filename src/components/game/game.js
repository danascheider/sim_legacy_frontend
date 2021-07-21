import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import styles from './game.module.css'

const DEFAULT_DESCRIPTION = 'This game has no description.'
const DESTROY_CONFIRMATION = 'Are you sure you want to delete this game? This cannot be undone. You will lose all data associated with the game you delete.'

const Game = ({ gameId, name, description }) => {
  const [toggleEvent, setToggleEvent] = useState(0)

  const { setFlashProps, setFlashVisible } = useAppContext()
  const {
    performGameDestroy,
    setGameEditFormVisible,
    setGameEditFormProps
  } = useGamesContext()

  const mountedRef = useRef(true)
  const iconsRef = useRef(null)
  const editRef = useRef(null)
  const destroyRef = useRef(null)

  const refContains = (ref, el) => ref.current && (ref.current === el || ref.current.contains(el))

  const toggleDescription = e => {
    if (!e || !refContains(iconsRef, e.target)) setToggleEvent(Date.now)
  }

  const showEditForm = () => {
    setFlashVisible(false)

    setGameEditFormProps({
      gameId: gameId,
      currentAttributes: { name, description }
    })

    setGameEditFormVisible(true)
  }

  const destroyGame = e => {
    const confirmed = window.confirm(DESTROY_CONFIRMATION)

    if (confirmed) {
      const callbacks = {
        onSuccess: () => mountedRef.current = false,
        onInternalServerError: () => setFlashVisible(true)
      }

      performGameDestroy(gameId, callbacks)
    } else {
      setFlashProps({
        type: 'info',
        message: 'Your game was not deleted.'
      })
      
      setFlashVisible(true)
    }
  }

  useEffect(() => (
    mountedRef.current = false
  ), [])

  return(
    <div className={styles.root}>
      <div className={styles.header} onClick={toggleDescription}>
        <span ref={iconsRef} className={styles.editIcons}>
          <button
            ref={destroyRef}
            className={styles.icon}
            onClick={destroyGame}
            data-testid={`destroy-icon-game-id-${gameId}`}
          >
            <FontAwesomeIcon className={styles.fa} icon={faTimes} />
          </button>
          <button
            ref={editRef}
            className={styles.icon}
            onClick={showEditForm}
            data-testid={`edit-icon-game-id-${gameId}`}
          >
            <FontAwesomeIcon className={styles.fa} icon={faEdit} />
          </button>
        </span>
        <h3 className={styles.name}>{name}</h3>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            <p className={styles.description}>{description || DEFAULT_DESCRIPTION}</p>
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

Game.propTypes = {
  gameId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string
}

export default Game
