import React from 'react'
import NavigationCard from '../navigationCard/navigationCard'
import styles from './navigationMosaic.module.css'

const NavigationMosaic = ({ cardArray }) => (
  <div className={styles.root}>
    {cardArray.map(({ backgroundColor, textColor, href, children, key }) => (
      <div key={key} className={styles.card}>
        <NavigationCard 
          backgroundColor={backgroundColor}
          textColor={textColor}
          href={href}
          children={children}
        />
      </div>
    ))}
  </div>
)

export default NavigationMosaic
