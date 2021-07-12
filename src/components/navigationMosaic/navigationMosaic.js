import React from 'react'
import PropTypes from 'prop-types'
import { ColorProvider } from '../../contexts/colorContext'
import NavigationCard from '../navigationCard/navigationCard'
import styles from './navigationMosaic.module.css'

const NavigationMosaic = ({ cardArray }) => (
  <div className={styles.root}>
    {cardArray.map(({ colorScheme, href, children, key }) => (
      <div key={key} className={styles.card}>
        <ColorProvider colorScheme={colorScheme}>
          <NavigationCard 
            href={href}
            children={children}
          />
        </ColorProvider>
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
        schemeColorDarkest: PropTypes.string.isRequired,
        schemeColorDark: PropTypes.string.isRequired,
        schemeColorLight: PropTypes.string.isRequired,
        schemeColorLightest: PropTypes.string.isRequired,
        hoverColorDark: PropTypes.string.isRequired,
        hoverColorLight: PropTypes.string.isRequired,
        hoverColorLightest: PropTypes.string.isRequired,
        textColorPrimary: PropTypes.string.isRequired,
        textColorSecondary: PropTypes.string,
        textColorTertiary: PropTypes.string,
        borderColor: PropTypes.string
      }).isRequired
    })
  ).isRequired
}

export default NavigationMosaic
