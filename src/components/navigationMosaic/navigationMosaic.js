import React from 'react'
import NavigationCard from '../navigationCard/navigationCard'
import styles from './navigationMosaic.module.css'

const NavigationMosaic = ({ cardArray }) => (
  <div className={styles.root}>
    {cardArray.map(card => <div className={styles.card}><NavigationCard {... card} /></div>)}
  </div>
)

export default NavigationMosaic
