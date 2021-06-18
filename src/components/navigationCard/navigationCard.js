import React from 'react'
import styles from './navigationCard.module.css'

const NavigationCard = ({ backgroundColor, textColor, href, children}) => (
  <div className={styles.root} style={{'--background-color': backgroundColor, '--text-color': textColor}}>
    <a className={styles.link} href={href}>
      {children}
    </a>
  </div>
)

export default NavigationCard
