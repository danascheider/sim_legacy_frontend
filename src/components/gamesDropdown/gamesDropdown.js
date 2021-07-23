import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { useGamesContext } from '../../hooks/contexts'
import styles from './gamesDropdown.module.css'

// TODO:
// - Make focus shift between the list items when you push the arrow
//   keys (up/down) from the input

const GamesDropdown = ({ onSelectGame, defaultGame = null }) => {
  const { games } = useGamesContext()

  const [activeGame, setActiveGame] = useState(defaultGame || games[0])
  const [filteredGames, setFilteredGames] = useState(games)
  const [dropdownExpanded, setDropdownExpanded] = useState(false)
  const [inputValue, setInputValue] = useState(activeGame ? activeGame.name : '')

  const componentRef = useRef(null)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  const expandDropdown = () => setDropdownExpanded(true)
  const collapseDropdown = useCallback(() => setDropdownExpanded(false), [setDropdownExpanded])
  const toggleDropdown = () => setDropdownExpanded(!dropdownExpanded)

  const selectGame = (game) => {
    setActiveGame(game)
    setInputValue(game.name)
    onSelectGame(game)
    collapseDropdown()
  }

  // If the user has typed a string into the input, filter the games to only display
  // the ones that match what they've typed. 
  const filterGames = str => {
    if (str) {
      const tmpGames = games.filter(game => game.name.toLowerCase().match(new RegExp(str.toLowerCase(),'i')))
      setFilteredGames([...tmpGames])
    } else {
      setFilteredGames(games)
    }
  }

  // When the focus is moved away from the input onto a different element
  // entirely (and not just onto the button or options), we want to reset
  // either set the game indicated  
  const setGameOrResetInputValue = e => {
    if (componentRef.current.contains(e.relatedTarget)) return

    const game = filteredGames.find(g => g.name.toLowerCase() === inputValue.toLowerCase())

    if (game) {
      setActiveGame(game).then(() => setInputValue(activeGame.name))
    } else {
      setInputValue(activeGame.name)
    }
  }

  const isActiveGame = id => {
    if (activeGame && !games.length) return false

    return activeGame ? activeGame.id === id : id === games[0].id
  }

  const updateValue = e => {
    setInputValue(e.currentTarget.value)
    filterGames(e.currentTarget.value)
  }

  useEffect(() => {
    const collapseDropdownWhenClickedOutside = e => {
      if (componentRef.current !== e.target && !componentRef.current.contains(e.target)) collapseDropdown()
    }

    const collapseDropdownAndResetValue = e => {
      if (componentRef.current !== e.relatedTarget && !componentRef.current.contains(e.relatedTarget)) {
        // Hide the dropdown
        collapseDropdown()

        // Find out if there is a game whose title exactly matches the
        // text typed into the input (without regard to case).
        const game = filteredGames.find(g => g.name.toLowerCase() === inputValue.toLowerCase())

        if (game) {
          // If there is a matching game, it should be selected when the
          // component is no longer focussed.
          setActiveGame(game)
          setInputValue(game.name)
          onSelectGame(game)
        } else {
          // If there is no matching game, the input value should be reset
          // to the name of the active game.
          setInputValue(activeGame.name)
        }
      }
    }

    window.addEventListener('click', collapseDropdownWhenClickedOutside)
    document.addEventListener('focusout', collapseDropdownAndResetValue)

    return () => {
      window.removeEventListener('click', collapseDropdownWhenClickedOutside)
      document.removeEventListener('focusout', collapseDropdownAndResetValue)
    }
  }, [filteredGames, setActiveGame, setInputValue, collapseDropdown])

  return(
    <div ref={componentRef} className={styles.root}>
      <div
        className={classNames(styles.header, { [styles.headerExpanded]: dropdownExpanded })}
        role='combobox'
        aria-haspopup='listbox'
        aria-owns='gamesListbox'
        aria-controls='gamesListbox'
        aria-expanded={dropdownExpanded}
      >
        <input
          ref={inputRef}
          className={classNames(styles.input, 'focusable')}
          type='text'
          value={inputValue}
          onChange={updateValue}
          placeholder='No games available'
          aria-autocomplete='list'
          aria-multiline={false}
          aria-controls='gamesListbox'
          onFocus={expandDropdown}
          onClick={expandDropdown}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const game = games.find(g => g.name === e.target.value)
              game && selectGame(game)
            } else if (e.key === 'ArrowUp') {
              const allFocusables = document.getElementsByClassName('focusable')
              allFocusables[allFocusables.length - 1].focus()
            } else if (e.key === 'ArrowDown') {
              document.getElementsByClassName('focusable')[1].focus()
            }
          }}
        />
        <button
          ref={buttonRef}
          className={styles.trigger}
          onClick={toggleDropdown}
        >
          <FontAwesomeIcon className={styles.fa} icon={faAngleDown} />
        </button>
      </div>
      <ul id='gamesListbox' className={classNames(styles.dropdown, { [styles.hidden]: !dropdownExpanded })} role='listbox'>
        {filteredGames.map(({ id, name }, index) => {
          return(
            <li
              className={classNames(styles.option, 'focusable')}
              onClick={() => selectGame({ id, name })}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectGame({ id, name })
                } else if (e.key === 'ArrowUp') {
                  const focusables = [...document.getElementsByClassName('focusable')]
                  const index = focusables.indexOf(e.target)
                  focusables[index - 1].focus()
                } else if (e.key === 'ArrowDown') {
                  const focusables = [...document.getElementsByClassName('focusable')]
                  const index = focusables.indexOf(e.target)
                  const nextIndex = index < focusables.length - 1 ? index + 1 : 0
                  focusables[nextIndex].focus()
                }
              }}
              key={`${name.replace(' ', '_')}-${id}`}
              role='option'
              aria-selected={isActiveGame(id)}
              tabIndex={0}

            >{name}</li>
          )
        })}
      </ul>
    </div>
  )
}

GamesDropdown.propTypes = {
  onSelectGame: PropTypes.func.isRequired,
  defaultGame: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
}

export default GamesDropdown
