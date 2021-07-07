/*
 *
 * For more information about contexts and how they are used in SIM,
 * visit the docs on SIM contexts (/docs/contexts.md)
 * 
 * This context makes heavy use of the SIM API. The requests it makes are
 * mediated through the simApi module (/src/utils/simApi.js). To get information
 * about the API, its requirements, and its responses, visit the docs:
 * https://github.com/danascheider/skyrim_inventory_management/tree/main/docs/api
 * 
 */

import { createContext, useEffect, useState, useRef } from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { sessionCookieName } from '../utils/config'
import { fetchUserProfile } from '../utils/simApi'
import logOutWithGoogle from '../utils/logOutWithGoogle'
import isStorybook from '../utils/isStorybook'
import paths from '../routing/paths'

const LOADING = 'loading'
const DONE = 'done'

const AppContext = createContext()

// overrideValue allows us to set the context value in Storybook.
// I hate having the testing apparatus baked into the app code but
// none of the solutions I found worked and I don't understand
// Storybook decorators and whatnot enough to figure out how to
// set the value for the context in the story,
const AppProvider = ({ children, overrideValue = {} }) => {
  const [cookies, setCookie, removeCookie] = useCookies([sessionCookieName])
  const [profileData, setProfileData] = useState(overrideValue.profileData)
  const [redirectPath, setRedirectPath] = useState(overrideValue.shouldRedirectTo)
  const [profileLoadState, setProfileLoadState] = useState(overrideValue.profileLoadState || LOADING)

  const mountedRef = useRef(true)

  const removeSessionCookie = () => removeCookie(sessionCookieName)
  const setSessionCookie = token => setCookie(sessionCookieName, token)

  const setShouldRedirectTo = path => {
    setRedirectPath(path)
    mountedRef.current = false
  }

  const value = {
    token: cookies[sessionCookieName],
    profileData,
    removeSessionCookie,
    setSessionCookie,
    profileLoadState,
    setShouldRedirectTo,
    ...overrideValue // enables you to only change certain values
  }

  const onAuthenticatedPage = window.location.pathname !== paths.login && window.location.pathname !== paths.home

  const shouldFetchProfileData = !overrideValue.profileData && cookies[sessionCookieName] && onAuthenticatedPage

  const fetchProfileData = () => {
    if (shouldFetchProfileData) {
      fetchUserProfile(cookies[sessionCookieName])
        .then(response => response.json())
        .then(data => {
          setProfileData(data)
          if (!overrideValue.profileLoadState) setProfileLoadState(DONE)
        })
        .catch(error => {
          console.error('Error returned while fetching profile data: ', error.message)

          logOutWithGoogle(() => {
            cookies[sessionCookieName] && removeSessionCookie()
            if (onAuthenticatedPage) {
              setShouldRedirectTo(paths.login)
              mountedRef.current = false
            }
          })
        })
    } else if (!cookies[sessionCookieName] && !isStorybook()) {
      logOutWithGoogle(() => {
        if (onAuthenticatedPage) {
          setShouldRedirectTo(paths.login)
          mountedRef.current = false
        }
      })
    } else if (isStorybook() && !overrideValue.profileLoadState) setProfileLoadState(DONE) 
  }

  useEffect(fetchProfileData, [onAuthenticatedPage])
  useEffect(() => (
    () => { mountedRef.current = false }
  ))

  return(
    <AppContext.Provider value={value}>
      {redirectPath ? <Redirect to={redirectPath} /> : children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
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

export { AppContext, AppProvider }
