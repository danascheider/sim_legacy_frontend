import React from 'react'
import PropTypes from 'prop-types'
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

NavigationCard.propTypes = {
  colorScheme: PropTypes.shape({
    schemeColor: PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    borderColor: PropTypes.string,
    schemeColorLighter: PropTypes.string,
    hoverColorLighter: PropTypes.string,
    schemeColorLightest: PropTypes.string,
    textColorSecondary: PropTypes.string,
    textColorTertiary: PropTypes.string
  }).isRequired,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default NavigationCard
