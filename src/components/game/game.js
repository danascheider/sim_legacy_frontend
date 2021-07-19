import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import useComponentVisible from '../../hooks/useComponentVisible'
import styles from './game.module.css'

const DEFAULT_DESCRIPTION = 'This game has no description.'

const Game = ({ gameId, name, description }) => {
  const [toggleEvent, setToggleEvent] = useState(0)

  const { hideFlash } = useAppContext()
  const { performGameUpdate, setGameEditFormVisible, setGameEditFormProps } = useGamesContext()

  const iconsRef = useRef(null)
  const editRef = useRef(null)

  const refContains = (ref, el) => ref.current && (ref.current === el || ref.current.contains(el))

  const toggleDescription = e => {
    if (!e || !refContains(iconsRef, e.target)) setToggleEvent(Date.now)
  }

  const showEditForm = () => {
    hideFlash()

    setGameEditFormProps({
      gameId: gameId,
      currentAttributes: { name, description }
    })

    setGameEditFormVisible(true)
  }

  return(
    <div className={styles.root}>
      <div className={styles.header} onClick={toggleDescription}>
        <span ref={iconsRef} className={styles.editIcons}>
          <button className={styles.icon} ref={editRef} onClick={showEditForm}>
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
