/*
 *
 * For more information about contexts and how they are used in SIM,
 * visit the docs on SIM contexts (/docs/contexts.md)
 *
 */

import { createContext } from 'react'
import PropTypes from 'prop-types'


const ColorContext = createContext()

const ColorProvider = ({ colorScheme, children }) => {
  return(
    <ColorContext.Provider value={colorScheme}>
      {children}
    </ColorContext.Provider>
  )
}

ColorProvider.propTypes = {
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
  }).isRequired,
  children: PropTypes.node.isRequired
}

export { ColorProvider, ColorContext }
