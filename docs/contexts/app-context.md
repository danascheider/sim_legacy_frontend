# AppContext

The `AppContext` keeps track of dashboard and login data. It is used on all pages and also handles redirect behaviour for the entire app. Redirect behaviour is specified in individual components using the `setShouldRedirectTo` function that the context provider returns, and the provider then renders the redirect to the path specified. The `AppProvider` determines whether a user is logged in, and whether the user has visited an authenticated page (i.e., anything but home or login).

The `AppProvider`'s value includes the following:

* `token`: The JWT token assigned by Google and stored in the `_sim_google_session` cookie. The context provider gets the value from the cookie, not from Google directly.
* `profileData`: The user's profile data returned from the API, which is fetched when the component renders provided there is a `token`.
* `setSessionCookie`: A function, which takes a JWT token from Google as an argument and sets it as the value of the `_sim_google_session` cookie. This is used in the `LoginPage` component.
* `removeSessionCookie`: A function, which takes zero arguments and removes the `_sim_google_session` cookie. This is used in logout callbacks.
* `profileLoadState`: The status of profile data loading, either 'loading' or 'done'
* `setShouldRedirectTo`: A setter function that immediately causes the user to be redirected to the path passed in. If you are logging the user out, you should use the `logOutAndRedirect` function instead.
* `logOutAndRedirect`: A function that logs the user out with Google, redirects to the `path` passed in, unmounts the context provider, and runs a callback function if one is given. The callback function takes no arguments and can be used to clean up refs/unmount consumer components following the redirect.
* `flashProps`: The props with which to render the flash message element (if any)
* `flashVisible`: Whether the flash message element (if any) should be visible on the page
* `setFlashProps`: A function that enables you to set the type ('error', 'info', or 'success'), message, and header of the `FlashMessage` component (consumers are responsible for rendering the flash message)
* `setFlashVisible`: A function that enables you to set the `flashVisible` value to `true` or `false`
* `modalVisible`: A boolean value indicating whether a modal, if it is present on the page, should be shown
* `modalAttributes`: An object indicating the component the modal should display as well as the props that should be passed through to the modal component
* `setModalVisible`: A function that enables you to set the `modalVisible` value to `true` or `false`
* `setModalAttributes`: A function enabling you to set the attributes for the modal. There are two required keys:
  * `Tag`: The component that the modal should wrap
  * `props`: The combined props for the modal component and the wrapped component; any values that are not possible props of the `Modal` component will be passed through to the wrapped component. Possible values depend on the props of the wrapped component, but the following are always allowed:
    * `title` (required): The main heading of the modal itself
    * `subtitle`: The subheading of the modal itself

## Redirect Behaviour

### Homepage

When a user visits the homepage (`/`), the `AppProvider` checks for a token. If the `_sim_google_session` cookie is not set, the homepage is displayed. If the cookie is set, the homepage verifies that the token is still valid by checking with the back end. If it is valid, the user is redirected to the dashboard. If there is no cookie or the API returns a 401 error, the user stays on the homepage and the invalid cookie (if it exists) is removed.

### Login Page

When a user visits the login page (`/login`) and the user is logged in with a cookie set, the Google OAuth success callback is run. If the user doesn't have a token and/or isn't logged in according to Google, they stay on the login page and are able to log (back) in.

### Dashboard Pages

When a user visits the dashboard and is not logged in or doesn't have the `_sim_google_session` cookie set, they are redirected to the login page.

### Logout

When the user logs out from their dashboard, they are redirected to the homepage.

## Using the Context

The `AppContext` follows a similar pattern to the `ColorContext`. Unlike the `ColorProvider`, the `AppProvider` doesn't have any required props as it generates all its own data. The `AppProvider` wraps all page components.

For the sake of completeness, the use of the `AppProvider` is illustrated here:

```js
// wherever you render the page component - this should
// ordinarily be done in /src/routing/pageRoutes.js, which
// renders the provider automatically.

import React from 'react'
import { AppProvider } from '../contexts/dashboardContext'
import { PageComponent } from '../pages/pageComponent.js'

const Parent = () => (
  <AppProvider><PageComponent /></AppProvider>
)

export default Parent

// In /src/pages/pageComponent.js
import React, { useEffect } from 'react'
import { fetchShoppingLists } from '../utils/simApi'
import { useAppContext } from '../hooks/contexts'

const PageComponent = () => {
  const { token } = useAppContext()

  const fetchData = () => {
    if (token) {
      fetchShoppingLists(token).then(() => { /* do something */ })
    }
  }

  useEffect(fetchData, [])

  return(
    <div>
      Child components can use the useAppContext hook too.
    </div>
  )
}

export default PageComponent
```

## Logging the User Out

The `AppProvider` provides the `removeSessionCookie` value, however, it is important to note that removing the session cookie does not log the user out with Google. For this, the [`logOutWithGoogle` function](/src/utils/logOutWithGoogle.js) should be used with `removeSessionCookie` passed in in the `success` callback. The `logOutAndRedirect` function provided by the `AppContext` wraps this function and automatically redirects to the path specified after logout.

```js
const { logOutAndRedirect } = useAppContext()

// this is required in any component that calls
// setShouldRedirectTo
const mountedRef = useRef(true)

const logoutAndUnmount = () => {
  logOutAndRedirect(paths.login, () => mountedRef.current = false)
}

// This is also required in any component that
// uses setShouldRedirectTo
useEffect(() => {
  return () => (mountedRef.current = false)
}, [])

return(
  <div className={styles.root}>
    <button onClick={logOutAndUnmount}>Sign Out</button>
  </div>
)
```

## Preventing Memory Leaks with `setShouldRedirectTo`

When you use the `AppProvider`'s `setShouldRedirectTo` function from a consumer component, you will need to unmount the component after you do to prevent a memory leak. You do this using React's [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) and [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hooks.

```js
const Component = () => {
  const { token, removeSessionCookie, setShouldRedirectTo } = useAppContext()
  const mountedRef = useRef(true)
  
  const someCallback = () => {
    makeApiCall(token)
      .catch(error => {
        // simApi functions always throw an error object with a 401 code
        // if the error is a 401 response from the server.
        if (error.code === 401) {
          logOutWithGoogle(() => {
            token && removeSessionCookie
            setShouldRedirectTo(paths.login)

            // Unmount the component here
            mountedRef.current = false
          })
        }
      })
  }

  // This is critical to preventing the memory leak
  useEffect(() => (
    () => mountedRef.current = false
  ))
}
```
The function returned from the `useEffect` hook works as a cleanup function, ensuring that the `mountedRef.current` is set to `false` at the end of the component's lifecycle.

Note that it is necessary to include `mountedRef.current = false` in both places where it appears in this example - the `useEffect` cleanup function will only run at the end of the component lifecycle.

## Overriding Values for Testing in Storybook

The `AppProvider` has a built-in apparatus to make sure the desired values are present in Storybook (or Jest, but mostly Storybook): the `overrideValue` prop. You can use this prop to override some or all of the key-value pairs stored in the provider's `value` object (i.e., the object returned from `useAppContext`). Any value you don't specify will be given the value the provider computes.

In general, you'll want to provide a `token` value (unless your story is intended to test what happens when there isn't a token - this should be rare since usually that case results in a redirect, which is better tested with Jest). Often you'll want to mock other values, such as `profileData`, as well. You can do this like so:
```js
// object imitates the data returned from the API
const profileData = {
  id: 348,
  uid: 'dragonborn@gmail.com',
  email: 'dragonborn@gmail.com',
  name: 'Jane Doe',
  image_url: null
}

export const Default = () => (
  <AppProvider overrideValue={{token: 'xxxxxx', profileData }}>
    <YourComponent />
  </AppProvider>
)
```
Now, the data rendered in your component will use the token value and profile data given. If an API call is used in your component, it should be mocked with [msw](https://mswjs.io/) to make sure a 401 isn't returned due to an invalid token.



