import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import useColorScheme from '../../hooks/useColorScheme'
import styles from './navigationCard.module.css'

const NavigationCard = ({ href, children }) => {
  const [{ schemeColor, hoverColor, textColorPrimary}] = useColorScheme()

  const styleVars = {
    '--background-color': schemeColor,
    '--hover-color': hoverColor,
    '--text-color': textColorPrimary
  }

  return(
    <Link className={styles.root} to={href} style={styleVars}>
      {children}
    </Link>
  )
}

NavigationCard.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default NavigationCard
