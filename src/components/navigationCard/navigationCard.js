import React from 'react'
import { Link } from 'react-router-dom'
import styles from './navigationCard.module.css'

const NavigationCard = ({ backgroundColor, textColor, href, children }) => (
  <Link className={styles.root} to={href} style={{'--background-color': backgroundColor, '--text-color': textColor}}>
    {children}
  </Link>
)

export default NavigationCard
