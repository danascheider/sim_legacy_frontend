import React, { useState, useRef } from 'react'
import SlideToggle from 'react-slide-toggle'
import styles from './game.module.css'

const DEFAULT_DESCRIPTION = 'This game has no description.'

const Game = ({ name, description }) => {
  const [toggleEvent, setToggleEvent] = useState(0)

  const toggleDescription = () => {
    setToggleEvent(Date.now)
  }

  return(
    <div className={styles.root}>
      <h3 className={styles.name} onClick={toggleDescription}>{name}</h3>
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

export default Game
