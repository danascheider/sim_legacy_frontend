import React from 'react'
import { Link } from 'react-router-dom'
import styles from './navigationCard.module.css'

const NavigationCard = ({ colorScheme, href, children }) => {
  const styleVars = {
    '--background-color': colorScheme.schemeColor,
    '--hover-color': colorScheme.hoverColor,
    '--text-color': colorScheme.textColorPrimary
  }

  return(
    <Link className={styles.root} to={href} style={styleVars}>
      {children}
    </Link>
  )
}

export default NavigationCard
