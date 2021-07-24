import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styles from './gamesDropdownOption.module.css'

const GamesDropdownOption = ({
  name,
  className,
  onClick,
  onKeyDown,
  ariaSelected
}) => {
  return(
    <li
      className={classNames(styles.root, className)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role='option'
      tabIndex={0}
      aria-selected={ariaSelected}
    >
      {name.length > 24 ? `${name.substring(0, 23)}...` : name}
    </li>
  )
}

GamesDropdownOption.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  ariaSelected: PropTypes.bool.isRequired
}

export default GamesDropdownOption
