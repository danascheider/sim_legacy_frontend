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
  children: PropTypes.node.isRequired
}

export { ColorProvider, ColorContext }
