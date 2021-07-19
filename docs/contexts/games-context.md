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

Function to create a game. Takes four possible arguments:

* `attrs` (required): The attributes to be used to create the game. Can contain `"name"` and `"description"`. Both keys are optional.
* `onSuccess`: An optional success callback taking no arguments.
* `onErrorResponse`: An optional callback taking no arguments, called when the server returns a 422 error or other nonfatal error response (i.e., not 500).
* `onFatalError`: An optional callback taking no arguments, called when a fatal error is raised (i.e., 500 response from the server, or another unexpected or unhandled error).

### `performGameUpdate`

Function to update a game. Takes five possible arguments:

* `gameId` (required): The ID of the game to update.
* `attrs` (required): The new attributes to update the game with. Can contain `"name"` and `"description"`. Both keys are optional.
* `onSuccess`: An optional success callback taking no arguments.
* `onErrorResponse`: An optional callback taking no arguments, called when the server returns a 422 error or other nonfatal error response (fatal errors for this function are 404 and 500).
* `onFatalError`: An optional callback taking no arguments, called when a fatal error is raised (i.e., 404, 500, or another unexpected or unhandled error).

Note that no callbacks are run if the server returns a 401 error.

### `gameEditFormVisible`

A boolean value indicating whether the modal with the game edit form should be visible.

### `setGameEditFormVisible`

A setter function that sets a boolean value for `gameEditFormVisible`.

### `gameEditFormProps`

The props with which to render the game edit form. Possible values include:

* `gameId` (required): The ID of the game the edit form edits
* `currentAttributes` (required): The current `name` (required) and `description` of the game
* `elementRef`: A ref that will be applied to the top-level element of the form

