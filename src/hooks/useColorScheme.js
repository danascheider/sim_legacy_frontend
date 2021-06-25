import { useContext } from 'react'
import { ColorContext } from '../contexts/colorContext'

const useColorScheme = () => {
  const context = useContext(ColorContext)

  if (!context) { 
    throw new Error('useColorScheme must be used within a ColorProvider')
  }

  return context
}

export default useColorScheme
