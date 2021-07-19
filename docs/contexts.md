# Contexts in SIM

SIM uses [React contexts](https://reactjs.org/docs/context.html) for management of certain state. This prevents "smart" components that fetch data or control state from having to pass through props to their children, their children's children, and so on. There are currently three contexts:

* [AppContext](#dashboardcontext)
* [GamesContext](#gamescontext)
* [ShoppingListContext](#shoppinglistcontext)
* [ColorContext](#colorcontext)

For each context, there is a [custom hook](/src/hooks/contexts.js) that can be used to invoke it in consumers.

## AppContext

The `AppContext` keeps track of dashboard and login data. It is used on all pages and also handles redirect behaviour for the entire app. Redirect behaviour is specified in individual components using the `setShouldRedirectTo` function that the context provider returns, and the provider then renders the redirect to the path specified. The `AppProvider` determines whether a user is logged in, and whether the user has visited an authenticated page (i.e., anything but home or login).

The `AppProvider`'s value includes the following:

* `token`: The JWT token assigned by Google and stored in the `_sim_google_session` cookie. The context provider gets the value from the cookie, not from Google directly.
* `profileData`: The user's profile data returned from the API, which is fetched when the component renders provided there is a `token`.
* `setSessionCookie`: A function, which takes a JWT token from Google as an argument and sets it as the value of the `_sim_google_session` cookie. This is used in the `LoginPage` component.
* `removeSessionCookie`: A function, which takes zero arguments and removes the `_sim_google_session` cookie. This is used in logout callbacks.
* `profileLoadState`: The status of profile data loading, either 'loading' or 'done'
* `setShouldRedirectTo`: A setter function that immediately causes the user to be redirected to the path passed in. If you are logging the user out, you should use the `logOutAndRedirect` function instead.
* `logOutAndRedirect`: A function that logs the user out with Google, redirects to the `path` passed in, unmounts the context provider, and runs a callback function if one is given. The callback function takes no arguments and can be used to clean up refs/unmount consumer components following the redirect.
* `flashVisible`: Whether the flash message element (if any) should be visible on the page
* `flashProps`: The props with which to render the flash message element (if any)
* `displayFlash`: A function that enables you to pass in the flash type, message (or array of messages), and optional header to display a flash message with those values. Calls the `setFlashProps` and `setFlashVisible` functions.
* `hideFlash`: A function that hides any flash message currently visible on a consumer page.

### Redirect Behaviour

#### Homepage

When a user visits the homepage (`/`), the `AppProvider` checks for a token. If the `_sim_google_session` cookie is not set, the homepage is displayed. If the cookie is set, the homepage verifies that the token is still valid by checking with the back end. If it is valid, the user is redirected to the dashboard. If there is no cookie or the API returns a 401 error, the user stays on the homepage and the invalid cookie (if it exists) is removed.

#### Login Page

When a user visits the login page (`/login`) and the user is logged in with a cookie set, the Google OAuth success callback is run. If the user doesn't have a token and/or isn't logged in according to Google, they stay on the login page and are able to log (back) in.

#### Dashboard Pages

When a user visits the dashboard and is not logged in or doesn't have the `_sim_google_session` cookie set, they are redirected to the login page.

#### Logout

When the user logs out from their dashboard, they are redirected to the homepage.

### Using the Context

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

### Logging the User Out

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

### Preventing Memory Leaks with `setShouldRedirectTo`

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

### Overriding Values for Testing in Storybook

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



## GamesContext

The `GamesContext` is used to fetch all of a user's games when any page that uses them renders. Like the `AppContext`, it has an `overrideValue` prop that can be used for testing purposes. Setting `overrideValue.games` prevents games from being fetched on initial render.

The `GamesContext` is a consumer of the `AppContext`, implying that the `GamesProvider` must be rendered inside an `AppProvider`. From the `AppProvider`, the context takes the `token` (which it needs to make API calls) as well as the `logOutAndRedirect` function. The latter is used in the event an API call returns status 401 and the user needs to be logged out.

On render, the `GamesProvider` fetches all the user's games.

### Value

The value of the `GamesProvider` consists of the following.

#### `games`

All of the user's games retrieved from the API.

#### `gameLoadingState`

Whether games have loaded successfully. Possible values are `'loading'`, `'done'`, and `'error'`.

#### `performGameCreate`

Function to create a game. Takes four possible arguments:

* `attrs` (required): The attributes to be used to create the game. Can contain `"name"` and `"description"`. Both keys are optional.
* `onSuccess`: An optional success callback taking no arguments.
* `onErrorResponse`: An optional callback taking no arguments, called when the server returns a 422 error or other nonfatal error response (i.e., not 500).
* `onFatalError`: An optional callback taking no arguments, called when a fatal error is raised (i.e., 500 response from the server, or another unexpected or unhandled error).

#### `performGameUpdate`

Function to update a game. Takes five possible arguments:

* `gameId` (required): The ID of the game to update.
* `attrs` (required): The new attributes to update the game with. Can contain `"name"` and `"description"`. Both keys are optional.
* `onSuccess`: An optional success callback taking no arguments.
* `onErrorResponse`: An optional callback taking no arguments, called when the server returns a 422 error or other nonfatal error response (fatal errors for this function are 404 and 500).
* `onFatalError`: An optional callback taking no arguments, called when a fatal error is raised (i.e., 404, 500, or another unexpected or unhandled error).

Note that no callbacks are run if the server returns a 401 error.

#### `gameEditFormVisible`

A boolean value indicating whether the modal with the game edit form should be visible.

#### `setGameEditFormVisible`

A setter function that sets a boolean value for `gameEditFormVisible`.

#### `gameEditFormProps`

The props with which to render the game edit form. Possible values include:

* `gameId` (required): The ID of the game the edit form edits
* `currentAttributes` (required): The current `name` (required) and `description` of the game
* `elementRef`: A ref that will be applied to the top-level element of the form

## ShoppingListContext

The `ShoppingListContext` is used to fetch all the relevant shopping lists when the shopping list page renders. It uses some similar patterns to the `AppContext`, including the use of the `overrideValue` prop to set the value of the provider in Storybook.

The `ShoppingList` context is a consumer of the `AppContext` and the `GamesContext`, implying that the `ShoppingListProvider` can only be rendered inside both an `AppProvider` and a `GamesProvider`. You will see an error to this effect if you try to implement it another way. From the `AppProvider`, the context takes the `token` (which it needs to make its API calls) as well as the `logOutAndRedirect` function. The latter is used in the event an API call returns status 401 and the user needs to be logged out. From the `GamesProvider`, the context takes the list of the user's games, which is used to determine how to populate the dropdown on the shopping lists page and which shopping lists to display.

On render, the `ShoppingListProvider` fetches all the user's shopping lists. 

### Value

The value of the `ShoppingListProvider` includes the following.

#### `shoppingLists`

The array of all the user's shopping lists, with the aggregate list first.

#### `shoppingListLoadingState`

Whether the `shoppingLists` are 'loading' (waiting for the API call to resolve), 'done' (when the API call is finished), or 'error' (when the API call has returned or thrown an error).

#### `performShoppingListCreate`

A function that creates a shopping list for the authenticated user and updates the aggregate list to reflect the change, also encompassing error handling logic. The function takes 3 arguments:

* `title`: the title of the new list. Must be unique, contain only alphanumeric characters and spaces, and cannot be any form of "Master". Will be reformatted on the backend to use title casing
* `success`: an optional success callback that can be used for handling state within the component that calls the function
* `error`: an optional error callback that can be used to clean up state within the component that calls the function

#### `performShoppingListUpdate`

A function that updates the list specified through the API, also encompassing error handling logic. The function takes 4 arguments:

* `listId`: the ID (primary key in the database) of the list to be updated
* `newTitle`: the new title of the list taken from the form the user submitted
* `success`: an optional success callback that can be used for handling state within the component that calls the function
* `error`: an optional error callback that can be used to clean up state within the component that calls the function

#### `performShoppingListDestroy`

A function that deletes the list specified through the API, also encompassing error handling logic. The function takes 3 arguments:

* `listId`: the ID (primary key in the database) of the list to be updated
* `success`: an optional success callback that can be used for handling state within the component that calls the function
* `error`: an optional error callback that can be used to clean up state within the component that calls the function

#### `performShoppingListItemCreate`

A function that creates a shopping list item on the list specified (or combines the new attributes given with an existing item with the same description), also encompassing error handling logic. This will also cause the aggregate list to update. The function takes four arguments:

* `listId`: the ID of the shopping list the item should be added to
* `attrs`: The attributes the item should be created with. Attributes can include:
  * `description` (string, required, case-insensitively unique per list)
  * `quantity` (integer, required, must be greater than 0)
  * `notes` (any notes associated with other item - will be combined with existing notes if the item is combined with another existing item)
* `success`: an optional success callback that can be used for handling state within the component that calls the function
* `error`: an optional error callback that can be used to clean up state within the component that calls the function

#### `performShoppingListItemUpdate`

A function that updates the specified shopping list item, also encompassing error handling logic. This will also cause the aggregate list to update. The function takes four arguments:

* `itemId`: the ID of the item to be updated
* `attrs`: the attributes to be updated on the list item. Cannot update item `description`. Attributes can include:
  * `quantity` (integer, greater than 0)
  * `notes` (string)
* `showFlashOnSuccess`: whether a successful API call should result in a flash message being displayed (the flash message will always be displayed on failure)
* `success`: an optional success callback that can be used for handling state within the component that calls the function
* `error`: an optional error callback that can be used for cleaning up state within the component that calls the function

#### `performShoppingListItemDestroy`

A function that destroys the specified shopping list item, also encompassing error handling logic. This also updates the aggregate list to reflect the change. The function takes three arguments:

* `itemId`: the ID of the item to be destroyed
* `success`: an optional success callback that can be used for handling state within the component that calls the function
* `error`: an optional error callback that can be used for cleaning up state within the component that calls the function

#### `listItemEditFormProps`

The props to be passed to the `ShoppingListItemEditForm` component if it is displayed.

#### `listItemEditFormVisible`

Whether the `ShoppingListItemEditForm` component should be visible.

#### `setListItemEditFormProps`

A setter function for shopping list item edit form props. Takes an object as an argument. The object should represent valid props for a `ShoppingListItemEditForm` (as indicated by [the component's PropTypes](/src/components/shoppingListItemEditForm/shoppingListItemEditForm.js)).

#### `setListItemEditFormVisible`

A setter function to indicate whether the `ShoppingListEditForm` component should be displayed or hidden. Takes a single boolean argument.

### Testing Components in Storybook

The `ShoppingListContext` is a little easier to work with in Storybook than the `AppContext`. While it still has an `overrideValues` prop, it isn't needed quite as much to make the basics work and you should only need it to, for example, set the loading state to 'loading' if a story needs to display that state. The rest of the testing can mostly be handled by mocking the API calls the provider makes using `msw`. Remember that the `ShoppingListProvider` component needs to be wrapped in a `AppProvider`, which will require override values for at least the token if not other values as well.

**There are significant limitations to this approach.** Because MSW mocks do not have access to the internal state of the provider, mocked responses have to be based only on data included in the request itself or the initial values of the shopping lists and their items. For this reason, behaviour of components in Storybook should be considered primarily illustrative of component behaviour. Storybook cannot be used for testing edge cases and the components will behave strangely if you do anything too complicated.

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
  const { schemeColorDarkest, hoverColorDark, textColorPrimary } = useColorScheme()

  const styleVars = {
    '--background-color': schemeColorDarkest,
    '--hover-color': hoverColorDark,
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
