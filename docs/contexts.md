# Contexts in SIM

SIM uses [React contexts](https://reactjs.org/docs/context.html) for management of certain state. This prevents "smart" components that fetch data or control state from having to pass through props to their children, their children's children, and so on. There are currently two main contexts:

* [ColorContext](#colorcontext)
* [DashboardContext](#dashboardcontext)
* [ShoppingListContext](#shoppinglistcontext)

For each context, there is a [custom hook](/src/hooks/contexts.js) that can be used to invoke it in consumers.

## ColorContext

The `ColorContext` keeps track of colour schemes. Set the colour scheme in the provider and then access it in the child/consumer component:
```js
// /src/components/parent/parent.js
import React from 'react'
import { ColorProvider } from '../../contexts/colorContext'
import { GREEN } from '../../utils/colorSchemes'
import Child from '../child/child'

const Parent = () => (
  <ColorProvider colorScheme={GREEN}>
    <Child />
  </ColorProvider>
)

export default Parent

// /src/components/child/child.js
import React from 'react'
import { useColorScheme } from '../../hooks/contexts'
import styles from './child.module.css'

const Child = () => {
  const { schemeColor, hoverColor, textColorPrimary } = useColorScheme()

  const styleVars = {
    '--background-color': schemeColor,
    '--hover-color': hoverColor,
    '--text-color': textColorPrimary
  }

  return(
    <div className={styles.root} style={styleVars}>
      Content or child components go here.
    </div>
  )
}

export default Child
```
The variables you set in `styleVars` can then be used in the child's CSS:
```css
/* /src/components/child/child.module.css */
.root {
  color: var(--text-color);
  background-color: var(--background-color);
}

.root:hover {
  background-color: var(--hover-color);
}
```
The `useColorScheme` hook can also be used to access the colour scheme in the child's children, as long as the same colour scheme is wanted for them.

## DashboardContext

The `DashboardContext` keeps track of dashboard and login data. It is used on all dashboard pages. The `DashboardProvider` fetches the user's profile data on load (in a `useEffect` hook) if it finds a session cookie, and if the API returns a 401 error or no cookie is found, redirects the user to the login page. For that reason, using it on the login page, although that page uses some of the functionality it provides, would result in infinite recursion.

The `DashboardProvider`'s value includes the following:

* `token`: The JWT token assigned by Google and stored in the `_sim_google_session` cookie. The context provider gets the value from the cookie, not from Google directly.
* `profileData`: The user's profile data returned from the API, which is fetched when the component renders provided there is a `token`.
* `removeSessionCookie`: A function, which takes zero arguments and removes the `_sim_google_session` cookie. This is used in logout callbacks.
* `setProfileData`: A setter function enabling the `profileData` value to be set.
* `profileLoadState`: The status of profile data loading, either 'loading' or 'done'
* `setShouldRedirectTo`: A setter function that immediately causes the user to be redirected to the path passed in.

### Using the Context

The `DashboardContext` follows a similar pattern to the `ColorContext`. Unlike the `ColorProvider`, the `DashboardProvider` doesn't have any required props as it generates all its own data. The `DashboardProvider` should wrap a page component whose children use its data. In general, this is done automatically by rendering a `DashboardProvider` for all [page routes](/src/routing/pageRoutes.js) with the `useDashboardContext` property set to `true`.

For the sake of completeness, the use of the `DashboardProvider` is illustrated here:

```js
// wherever you render the page component - this should
// ordinarily be done in /src/routing/pageRoutes.js, which
// renders the provider automatically.

import React from 'react'
import { DashboardProvider } from '../contexts/dashboardContext'
import { PageComponent } from '../pages/pageComponent.js'

const Parent = () => (
  <DashboardProvider><PageComponent /></DashboardProvider>
)

export default Parent

// In /src/pages/pageComponent.js
import React from 'react'
import { fetchShoppingLists } from '../utils/simApi'
import { useDashboardContext } from '../hooks/contexts'

const PageComponent = () => {
  const { token } = useDashboardContext()

  const fetchData = () => {
    if (token) {
      fetchShoppingLists(token).then(() => { /* do something */ })
    }
  }

  return(
    <div>
      Child components can use the useDashboardContext hook too.
    </div>
  )
}

export default PageComponent
```

### Logging the User Out

The `DashboardProvider` provides the `removeSessionCookie` value, however, it is important to note that removing the session cookie does not log the user out with Google. For this, the [`logOutWithGoogle` function](/src/utils/logOutWithGoogle.js) should be used with `removeSessionCookie` passed in in the `success` callback.

```js
const { removeSessionCookie, setShouldRedirectTo } = useDashboardContext()

const mountedRef = useRef(true)

const logout = () => {
  logOutWithGoogle(() => {
    removeSessionCookie()
    setShouldRedirectTo(paths.login)
    mountedRef.current = false // more on this below
  })
}

useEffect(() => {
  return () => (mountedRef.current = false)
}, [])
```

### Preventing Memory Leaks with `setShouldRedirectTo`

When you use the `DashboardProvider`'s `setShouldRedirectTo` function from a consumer component, you will need to unmount the component after you do to prevent a memory leak. You do this using React's [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) and [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hooks.

```js
const Component = () => {
  const { token, removeSessionCookie, setShouldRedirectTo } = useDashboardContext()
  const mountedRef = useRef(true)
  
  const someCallback = () => {
    makeApiCall(token)
      .catch(error => {
        if (error.name === 'AuthorizationError') {
          logOutWithGoogle(() => {
            token && removeSessionCookie
            setShouldRedirectTo(paths.login)

            // Unmount the component
            mountedRef.current = false
          })
        }
      })
  }

  // This is critical to preventing the memory leak
  useEffect(() => {
    return () => (mountedRef.current = false)
  }, [])
}
```
The function returned from the `useEffect` hook works as a cleanup function, ensuring that the `mountedRef.current` is set to `false` at the end of the component's lifecycle.

### Overriding Values for Testing

The `DashboardProvider` has a built-in apparatus to make sure the desired values are present in Storybook: the `overrideValue` prop. You can use this prop to override some or all of the key-value pairs stored in the provider's `value` object (i.e., the object returned from `useDashboardContext`). Any value you don't specify will be given the value the provider computes.

In general, you'll want to provide a `token` value (unless your story is intended to test what happens when there isn't a token - this should be rare since usually that case results in a redirect). Often you'll want to mock other values, such as `profileData`, as well. You can do this like so:
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
  <DashboardProvider overrideValue={{token: 'xxxxxx', profileData }}>
    <YourComponent />
  </DashboardProvider>
)
```
Now, the data rendered in your component will use the token value and profile data given. If an API call is used in your component, it should be mocked with [msw](https://mswjs.io/) to make sure a 401 isn't returned due to an invalid token.

## ShoppingListContext

The `ShoppingListContext` is used to fetch all the relevant shopping lists when the shopping list page renders. It uses some similar patterns to the `DashboardContext`, including the use of the `overrideValue` prop to set the value of the provider in Storybook.

The `ShoppingList` context is a consumer of the `DashboardContext`, implying that the `useShoppingListContext` hook can only be used inside a `ShoppingListProvider`. You will see an error to this effect if you try to implement it another way. From the `DashboardProvider`, the context takes the `token` (which it needs to make its API calls) as well as the `removeSessionCookie` and `setShouldRedirectTo` functions. The latter two are used in the event an API call returns status 401 and thee user needs to be logged out. Like elsewhere, the `logOutWithGoogle` function is used for this, with the cookie being removed and the redirect set in the callback passed to that function.

On load, the `ShoppingListProvider` fetches all the user's shopping lists. It returns the following in its `value`:

* `shoppingLists`: the array of all the user's shopping lists, with the master list first
* `shoppingListLoadingState`: whether the `shoppingLists` are 'loading' (waiting for the API call to resolve), 'done' (when the API call is finished), or 'error' (when the API call has thrown an honest-to-god, unexpected error - not just when it returns a 400-range error code)
* `performShoppingListUpdate`: a function that updates the list specified through the API, also encompassing error handling logic. The function takes 4 arguments:
  * `listId`: The ID (primary key in the database) of the list to be updated
  * `newTitle`: The new title of the list taken from the form the user submitted
  * `success`: An optional success callback that can be used for handling state within the component that calls the function
  * `error`: An optional error callback that can be used to clean up state within the component that calls the function
* `flashProps`: The props to be passed to the `FlashMessage` component when/if it is displayed
* `flashVisible`: Whether a `FlashMessage` should be visible (set to `true` if there's been some kind of error)

### Testing

The `ShoppingListContext` is a little easier to test with in Storybook than the `DashboardContext`. While it still has an `overrideValues` prop, it isn't needed quite as much to make the basics work and you should only need it to, for example, set the loading state to 'loading' if a story needs to display that state. The rest of the testing can mostly be handled by mocking the API calls the provider makes using `msw`. Remember that the `ShoppingListProvider` component needs to be wrapped in a `DashboardProvider`, which will require override values for at least the token if not other values as well.
