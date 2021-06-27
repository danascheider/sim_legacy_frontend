import { createContext, useState } from 'react'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'
import { sessionCookieName } from '../utils/config'

const DashboardContext = createContext()

const DashboardProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies([sessionCookieName])
  const [profileData, setProfileData] = useState(null)

  const setSessionCookie = val => setCookie(sessionCookieName, val)
  const removeSessionCookie = () => removeCookie(sessionCookieName)

  const value = {
    token: cookies[sessionCookieName],
    profileData,
    setSessionCookie,
    removeSessionCookie,
    setProfileData
  }

  return(
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export { DashboardContext, DashboardProvider }
