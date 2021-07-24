/*
 *
 * This component is intended for use within the GamesDropdown.
 * The GamesDropdown mimics a native `select` element. It is
 * critical that this component's role and ARIA attributes not
 * be changed except to make it more accessible or fix bugs in
 * accessibility. If you need a different role or aria attributes,
 * pass the values in as props or create another component.
 *
 */

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
