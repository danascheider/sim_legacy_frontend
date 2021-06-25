import { createContext, useState, useMemo } from 'react'
import PropTypes from 'prop-types'


const ColorContext = createContext()

const ColorProvider = ({ colorScheme, children }) => {
  const [scheme, setScheme] = useState(colorScheme)
  const value = useMemo(() => [scheme, setScheme], [scheme])

  return(
    <ColorContext.Provider value={value} colorScheme={scheme}>
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
