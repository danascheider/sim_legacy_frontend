import React, { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { BLUE } from '../../utils/colorSchemes'
import { useGamesContext } from '../../hooks/contexts'
import useQuery from '../../hooks/useQuery'
import GamesDropdownOption from '../gamesDropdownOption/gamesDropdownOption'
import styles from './gamesDropdown.module.css'

const GamesDropdown = () => {
  const queryString = useQuery()

  const { games } = useGamesContext()

  const [activeGame, setActiveGame] = useState(null)
  const [filteredGames, setFilteredGames] = useState(games)
  const [dropdownExpanded, setDropdownExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const componentRef = useRef(null)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

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
    queryString.set('game_id', game.id)
    collapseDropdown()
  }, [queryString, collapseDropdown])

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

  const isActiveGame = id => {
    if (activeGame && !games.length) return false

    return activeGame ? activeGame.id === id : id === games[0].id
  }

  const updateValue = e => {
    setInputValue(e.currentTarget.value)
    filterGames(e.currentTarget.value)
  }

  useEffect(() => {
    if (!activeGame && games.length) {
      setActiveGame(games[0])
      setInputValue(games[0].name)
    }
  }, [activeGame, games])

  useEffect(() => {
    const targetIsInComponent = target => {
      !componentRef.current || componentRef.current === target || componentRef.current.contains(target)
    }

    const collapseDropdownWhenClickedOutside = e => {
      if (componentRef.current !== e.target && !componentRef.current.contains(e.target)) collapseDropdown()
    }

    const collapseDropdownAndResetValue = e => {
      if (componentRef.current !== e.relatedTarget && !componentRef.current.contains(e.relatedTarget)) {
        console.log('this is running somehow')
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
          queryString.set('game_id', game.id)
        } else {
          // If there is no matching game, the input value should be reset
          // to the name of the active game.
          activeGame && setInputValue(activeGame.name)
        }
      }
    }

    // window.addEventListener('click', collapseDropdownWhenClickedOutside, true)
    document.addEventListener('focusout', collapseDropdownAndResetValue)

    return () => {
      // window.removeEventListener('click', collapseDropdownWhenClickedOutside, true)
      document.removeEventListener('focusout', collapseDropdownAndResetValue)
    }
  }, [filteredGames, setActiveGame, activeGame, setInputValue, inputValue, queryString, collapseDropdown])

  return(
    <div ref={componentRef} className={styles.root} style={colorVars}>
      <div
        className={styles.header}
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
              const game = games.find(g => g.name.toLowerCase() === e.target.value.toLowerCase())
              game && selectGame(game)
            } else if (e.key === 'ArrowUp') {
              const focusables = document.getElementsByClassName('focusable')
              focusables[focusables.length - 1].focus()
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
      <ul
        id='gamesListbox'
        className={classNames(styles.dropdown, { [styles.hidden]: !dropdownExpanded })}
        role='listbox'
      >
        {filteredGames.map(({ id, name }, index) => {
          return(
            <GamesDropdownOption
              className='focusable'
              onClick={() => selectGame({ id, name })}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectGame({ id, name })
                } else if (e.key === 'ArrowUp') {
                  // e.preventDefault()
                  const focusables = [...document.getElementsByClassName('focusable')]
                  const index = focusables.indexOf(e.target)
                  focusables[index - 1].focus()
                } else if (e.key === 'ArrowDown') {
                  // e.preventDefault()
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
