import { createContext, useState } from 'react'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import { sessionCookieName } from '../utils/config'

const DashboardContext = createContext()

// overrideValue allows us to set the context value in Storybook.
// I hate having the testing apparatus baked into the app code but
// none of the solutions I found worked and I don't understand
// Storybook decorators and whatnot enough to figure out how to
// set the value for the context in the story,
const DashboardProvider = ({ children, overrideValue = {} }) => {
  const [cookies, setCookie, removeCookie] = useCookies([sessionCookieName])
  const [profileData, setProfileData] = useState(null)

  const setSessionCookie = val => setCookie(sessionCookieName, val)
  const removeSessionCookie = () => removeCookie(sessionCookieName)

  const value = {
    token: cookies[sessionCookieName],
    profileData,
    setSessionCookie,
    removeSessionCookie,
    setProfileData,
    ...overrideValue // enables you to only change certain values
  }

  return(
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
  overrideValue: PropTypes.shape({
    token: PropTypes.string,
    profileData: PropTypes.shape({
      id: PropTypes.number,
      uid: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      image_url: PropTypes.string
    }),
    setSessionCookie: PropTypes.func,
    removeSessionCookie: PropTypes.func,
    setProfileData: PropTypes.func
  })
}

export { DashboardContext, DashboardProvider }
