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

import { createContext, useEffect, useState, useRef, useCallback } from 'react'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { sessionCookieName } from '../utils/config'
import { fetchUserProfile } from '../utils/simApi'
import logOutWithGoogle from '../utils/logOutWithGoogle'
import isStorybook from '../utils/isStorybook'
import paths, { allPaths } from '../routing/paths'

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
  const [flashProps, setFlashProps] = useState({})
  const [flashVisible, setFlashVisible] = useState(false)
  const [profileData, setProfileData] = useState(overrideValue.profileData)
  const [redirectPath, setRedirectPath] = useState(overrideValue.shouldRedirectTo)
  const [profileLoadState, setProfileLoadState] = useState(overrideValue.profileLoadState || LOADING)

  const mountedRef = useRef(true)

  const removeSessionCookie = useCallback(() => removeCookie(sessionCookieName), [removeCookie])
  const setSessionCookie = token => setCookie(sessionCookieName, token)

  const setShouldRedirectTo = useCallback(path => {
    setRedirectPath(path)
    mountedRef.current = false
  }, [mountedRef])

  const displayFlash = useCallback((type, message, header = null) => {
    setFlashProps({ type, message, header })
    setFlashVisible(true)
  }, [setFlashProps, setFlashVisible])

  const hideFlash = useCallback(() => { setFlashVisible(false) }, [setFlashVisible])

  const value = {
    token: cookies[sessionCookieName],
    profileData,
    removeSessionCookie,
    setSessionCookie,
    profileLoadState,
    setShouldRedirectTo,
    flashVisible,
    flashProps,
    displayFlash,
    hideFlash,
    ...overrideValue // enables you to only change certain values
  }

  const onAuthenticatedPage = window.location.pathname !== paths.login && window.location.pathname !== paths.home && allPaths.indexOf(window.location.pathname) !== -1

  const shouldFetchProfileData = !overrideValue.profileData && cookies[sessionCookieName] && onAuthenticatedPage

  const logOutAndRedirect = useCallback(() => {
    logOutWithGoogle(() => {
      cookies[sessionCookieName] && removeSessionCookie()
      onAuthenticatedPage && setShouldRedirectTo(paths.login)
    })
  }, [cookies, removeSessionCookie, onAuthenticatedPage, setShouldRedirectTo])

  const fetchProfileData = () => {
    if (shouldFetchProfileData) {
      fetchUserProfile(cookies[sessionCookieName])
        .then(response => response.json())
        .then(data => {
          if (data.errors) {
            throw new Error('Internal Server Error: ', data.errors[0])
          } else {
            setProfileData(data)
            if (!overrideValue.profileLoadState) setProfileLoadState(DONE)
          }
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'production') console.error('Error returned while fetching profile data: ', error.message)

          // I feel like this might not be the right behaviour if the error was a 500,
          // but I also can't think of a case where an error like this would occur and
          // not be a 401, given the user profile will be created during the authorization
          // step if it doesn't exist already.
          logOutAndRedirect()
        })
    } else if (!cookies[sessionCookieName] && !isStorybook()) {
      logOutAndRedirect()
    } else if (isStorybook() && !overrideValue.profileLoadState) {
      setProfileLoadState(DONE)
    }
  }

  useEffect(fetchProfileData, [
                                onAuthenticatedPage,
                                logOutAndRedirect,
                                overrideValue.profileLoadState,
                                shouldFetchProfileData,
                                cookies
                              ])

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
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string
    }),
    setSessionCookie: PropTypes.func,
    removeSessionCookie: PropTypes.func,
    setProfileData: PropTypes.func,
    flashVisible: PropTypes.bool,
    flashProps: PropTypes.shape({
      type: PropTypes.oneOf(['error', 'info', 'success']).isRequired,
      message: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
      header: PropTypes.string
    }),
    displayFlash: PropTypes.func,
    hideFlash: PropTypes.func
  })
}

export { AppContext, AppProvider }
