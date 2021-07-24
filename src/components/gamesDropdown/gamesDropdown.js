/*
 * It was important to have a styled options list, so a native HTML select
 * dropdown wouldn't do. This component has been made to be as accessible as
 * possible, adhering to the ARIA specification for comboboxes. More information
 * on comboboxes and their expected behaviour can be found in the ARIA docs:
 * https://www.w3.org/TR/wai-aria-practices-1.1/examples/combobox/aria1.1pattern/listbox-combo.html
 *
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { BLUE } from '../../utils/colorSchemes'
import { useGamesContext } from '../../hooks/contexts'
import GamesDropdownOption from '../gamesDropdownOption/gamesDropdownOption'
import styles from './gamesDropdown.module.css'

const GamesDropdown = () => {
  const history = useHistory()

  const { games } = useGamesContext()

  const [activeGame, setActiveGame] = useState(null)
  const [dropdownExpanded, setDropdownExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const componentRef = useRef(null)

  const expandDropdown = () => setDropdownExpanded(true)
  const collapseDropdown = useCallback(() => setDropdownExpanded(false), [setDropdownExpanded])
  const toggleDropdown = () => setDropdownExpanded(!dropdownExpanded)

  const colorVars = {
    '--button-background-color': BLUE.schemeColorDarkest,
    '--button-hover-color': BLUE.hoverColorDark,
    '--button-text-color': BLUE.textColorPrimary,
    '--button-border-color': BLUE.borderColor
  }

  const selectGame = useCallback(game => {
    setActiveGame(game)
    setInputValue(game.name)
    
    const params = new URLSearchParams(`game_id=${game.id}`)
    history.push({ search: params.toString() })

    collapseDropdown()
  }, [history, collapseDropdown])

  const isActiveGame = id => {
    if (activeGame && !games.length) return false

    return activeGame ? activeGame.id === id : id === games[0].id
  }

  const updateValue = e => setInputValue(e.currentTarget.value)

  useEffect(() => {
    if (!activeGame && games.length) {
      setActiveGame(games[0])
      setInputValue(games[0].name)
    }
  }, [activeGame, games])

  useEffect(() => {
    const collapseDropdownAndResetValue = e => {
      if (componentRef.current !== e.relatedTarget && !componentRef.current.contains(e.relatedTarget)) {
        // Hide the dropdown
        collapseDropdown()

        // Find out if there is a game whose title exactly matches the
        // text typed into the input (without regard to case).
        const game = games.find(g => g.name.toLowerCase() === inputValue.toLowerCase())

        if (game) {
          // If there is a matching game, it should be selected when the
          // component is no longer focussed.
          setActiveGame(game)
          setInputValue(game.name)

          const params = new URLSearchParams(`game_id=${game.id}`)
          history.push({ search: params.toString() })
        } else {
          // If there is no matching game, the input value should be reset
          // to the name of the active game.
          activeGame && setInputValue(activeGame.name)
        }
      }
    }

    document.addEventListener('focusout', collapseDropdownAndResetValue)

    return () => {
      document.removeEventListener('focusout', collapseDropdownAndResetValue)
    }
  }, [games, setActiveGame, activeGame, setInputValue, inputValue, history, collapseDropdown])

  return(
    <div ref={componentRef} className={styles.root} style={colorVars} data-testid='games-dropdown'>
      <div
        className={styles.header}
        role='combobox'
        aria-haspopup='listbox'
        aria-owns='gamesListbox'
        aria-controls='gamesListbox'
        aria-expanded={dropdownExpanded}
      >
        <input
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
              const game = games.find(g => g.name.toLowerCase() === e.target.value.toLowerCase())
              game && selectGame(game)
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              const focusables = document.getElementsByClassName('focusable')
              focusables[focusables.length - 1].focus()
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              document.getElementsByClassName('focusable')[1].focus()
            } else if (e.key === 'Escape') {
              collapseDropdown()
            }
          }}
        />
        <button
          className={styles.trigger}
          onClick={toggleDropdown}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              document.getElementsByClassName('focusable')[1].focus()
            }
          }}
          data-testid='games-dropdown-trigger'
        >
          <FontAwesomeIcon className={styles.fa} icon={faAngleDown} />
        </button>
      </div>
      <ul
        id='gamesListbox'
        className={classNames(styles.dropdown, { [styles.hidden]: !dropdownExpanded || !games.length })}
        role='listbox'
      >
        {games.map(({ id, name }, index) => {
          return(
            <GamesDropdownOption
              className='focusable'
              onClick={() => selectGame({ id, name })}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectGame({ id, name })
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  const focusables = [...document.getElementsByClassName('focusable')]
                  const index = focusables.indexOf(e.target)
                  focusables[index - 1].focus()
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  const focusables = [...document.getElementsByClassName('focusable')]
                  const index = focusables.indexOf(e.target)
                  const nextIndex = index < focusables.length - 1 ? index + 1 : 0
                  focusables[nextIndex].focus()
                }
              }}
              key={`${name.toLowerCase().replace(' ', '_')}-${id}`}
              ariaSelected={isActiveGame(id)}
              name={name}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default GamesDropdown
