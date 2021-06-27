import { createContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { sessionCookieName } from '../utils/config'
import { fetchUserProfile } from '../utils/simApi'
import isStorybook from '../utils/isStorybook'
import paths from '../routing/paths'

const LOADING = 'loading'
const DONE = 'done'

const DashboardContext = createContext()

// overrideValue allows us to set the context value in Storybook.
// I hate having the testing apparatus baked into the app code but
// none of the solutions I found worked and I don't understand
// Storybook decorators and whatnot enough to figure out how to
// set the value for the context in the story,
const DashboardProvider = ({ children, overrideValue = {} }) => {
  const [cookies, setCookie, removeCookie] = useCookies([sessionCookieName])
  const [profileData, setProfileData] = useState(null)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [profileLoadState, setProfileLoadState] = useState(LOADING)

  const setSessionCookie = val => setCookie(sessionCookieName, val)
  const removeSessionCookie = () => removeCookie(sessionCookieName)

  const value = {
    token: cookies[sessionCookieName],
    profileData,
    setSessionCookie,
    removeSessionCookie,
    setProfileData,
    profileLoadState,
    ...overrideValue // enables you to only change certain values
  }

  const shouldFetchProfileData = !overrideValue.profileData && cookies[sessionCookieName]

  const fetchProfileData = () => {
    if (shouldFetchProfileData) {
      fetchUserProfile(cookies[sessionCookieName])
        .then(response => response.json())
        .then(data => {
          if (!data) {
            console.warn('No data reeceived from server - logging out user in case of an auth issue')
            cookies[sessionCookieName] && removeCookie(sessionCookieName)
            setShouldRedirect(true)
          } else if (data.error) {
            console.warn('Error fetching user data - logging out user: ', data.error)
            cookies[sessionCookieName] && removeCookie(sessionCookieName)
            setShouldRedirect(true)
          } else {
            setProfileData(data)
            if (!overrideValue.profileLoadState) setProfileLoadState(DONE)
          }
        })
        .catch(error => {
          console.error('Error returned while fetching profile data: ', error.message)
          cookies[sessionCookieName] && removeCookie(sessionCookieName)
          setShouldRedirect(true)
        })
    } else if (!cookies[sessionCookieName] && !isStorybook()) {
      setShouldRedirect(true)
    } else if (isStorybook() && !overrideValue.profileLoadState) setProfileLoadState(DONE) 
  }

  useEffect(fetchProfileData, [])

  return(
    <DashboardContext.Provider value={value}>
      {shouldRedirect ? <Redirect to={paths.login} /> : children}
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
