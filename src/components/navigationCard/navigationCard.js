import React from 'react'
import styles from './navigationCard.module.css'

const NavigationCard = ({ backgroundColor, textColor, href, children}) => (
  <a className={styles.root} href={href} style={{'--background-color': backgroundColor, '--text-color': textColor}}>
    {children}
  </a>
)

export default NavigationCard
