# GamesContext

The `GamesContext` is used to fetch all of a user's games when any page that uses them renders. Like the `AppContext`, it has an `overrideValue` prop that can be used for testing purposes. Setting `overrideValue.games` prevents games from being fetched on initial render.

The `GamesContext` is a consumer of the `AppContext`, implying that the `GamesProvider` must be rendered inside an `AppProvider`. From the `AppProvider`, the context takes the `token` (which it needs to make API calls) as well as the `logOutAndRedirect` function. The latter is used in the event an API call returns status 401 and the user needs to be logged out.

On render, the `GamesProvider` fetches all the user's games.

## Value

The value of the `GamesProvider` consists of the following.

### `games`

All of the user's games retrieved from the API.

### `gameLoadingState`

Whether games have loaded successfully. Possible values are `'loading'`, `'done'`, and `'error'`.

### `performGameCreate`

Function to create a game. Takes two possible arguments:

* `attrs` (required): The attributes to be used to create the game. Can contain `"name"` and `"description"`. Both keys are optional.
* `callbacks`: Four functions, all optional, to be run when the request completes, typically to unmount a component or do other cleanup. The possible functions are:
  * `onSuccess`: Runs when the API returns a 200-range response
  * `onUnauthorized`: Runs when the API returns 401 response
  * `onUnprocessableEntity`: Runs when the API returns a 422 response

The callback functions passed in are run after the context provider's own handlers complete. These handlers perform logic as follows:

* **On a 200-range response**, adds the new game returned in the API response to the existing array of games
* **On a 401 response**, logs the user out and redirects them to the login page, unmounting the context provider
* **On a 422 response**, logs the user out and displays a flash message with the validation errors (a `FlashMessage` component must be rendered by some visible consumer in order for the message to show up)
* **On a 500-range response**, hides the form and displays a flash error message if a consumer renders a `FlashMessage` component

### `performGameUpdate`

Function to update a game. Takes three possible arguments:

* `gameId` (required): The ID of the game to update.
* `attrs` (required): The new attributes to update the game with. Can contain `"name"` and `"description"`. Both keys are optional.
* `callbacks`: Up to five optional callbacks to handle any success or error state, typically used to unmount a component or do other cleanup work. The possible functions are:
  * `onSuccess`: Runs when the server returns a 200-range response
  * `onUnauthorized`: Runs when the server returns a 401 response
  * `onNotFound`: Runs when the server returns a 404 response
  * `onUnprocessableEntity`: Runs when the server returns a 422 response
  * `onInternalServerError`: Runs when the server returns a 500 response or an error is thrown while handling the response from the server

The callback functions passed in are run after the context provider's own handlers complete. These handlers perform logic as follows:

* **On a 200-range response**, updates the game on the displayed list with the data returned from the API and displays a flash success message (if a visible consumer of the context renders a `FlashMessage` component)
* **On a 401 response**, logs the user out and redirects them to the login page, unmounting the context provider
* **On a 404 response**, hides the form and displays a flash message (if consumers render one) telling the user to fix the problem by refreshing
* **On a 422 response**, hides the form and displays a flash message with the validation errors (if consumers render one)
* **On a 500-range response**, hides the form and displays a flash error message (if consumers render one)

Note that no callbacks are run if the server returns a 401 error.

### `gameEditFormVisible`

A boolean value indicating whether the modal with the game edit form should be visible.

### `setGameEditFormVisible`

A setter function that sets a boolean value for `gameEditFormVisible`.

### `gameEditFormProps`

The props with which to render the game edit form. Values include:

* `gameId` (required): The ID of the game the edit form edits
* `currentAttributes` (required): The current `name` (required) and `description` (optional) of the game
* `elementRef`: An optional ref that will be applied to the top-level element of the form component (which is a `div`)

### `setGameEditFormProps`

A setter function setting the props with which to render the game edit form. The possible props are:

* `gameId` (required): The ID of the game the edit form edits
* `currentAttributes` (required): The current `name` (required) and `description` (optional) of the game
* `elementRef`: An optional ref that will be applied to the top-level element of the form component (which is a `div`)
