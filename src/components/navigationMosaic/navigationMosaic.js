import React from 'react'
import PropTypes from 'prop-types'
import NavigationCard from '../navigationCard/navigationCard'
import styles from './navigationMosaic.module.css'

const NavigationMosaic = ({ cardArray }) => (
  <div className={styles.root}>
    {cardArray.map(({ colorScheme, href, children, key }) => (
      <div key={key} className={styles.card}>
        <NavigationCard 
          colorScheme={colorScheme}
          href={href}
          children={children}
        />
      </div>
    ))}
  </div>
)

NavigationMosaic.propTypes = {
  cardArray: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      children: PropTypes.node.isRequired,
      key: PropTypes.string.isRequired,
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
      }).isRequired
    })
  ).isRequired
}

export default NavigationMosaic
