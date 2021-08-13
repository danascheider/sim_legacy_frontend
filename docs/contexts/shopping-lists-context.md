# ShoppingListsContext

The `ShoppingListsContext` is used to fetch all the relevant shopping lists when the shopping list page renders. It uses some similar patterns to the `AppContext`, including the use of the `overrideValue` prop to set the value of the provider in Storybook.

The `ShoppingListsContext` is a consumer of the `AppContext` and the `GamesContext`, implying that the `ShoppingListsProvider` can only be rendered inside both an `AppProvider` and a `GamesProvider`. You will see an error to this effect if you try to implement it another way. From the `AppProvider`, the context takes the `token` (which it needs to make its API calls) as well as the `logOutAndRedirect` function. The latter is used in the event an API call returns status 401 and the user needs to be logged out. From the `GamesProvider`, the context takes the list of the user's games, which is used to determine how to populate the dropdown on the shopping lists page and which shopping lists to display.

On render, the `ShoppingListsProvider` fetches all the shopping lists for the active game. 

## Value

The value of the `ShoppingListsProvider` includes the following.

### `shoppingLists`

The array of all the shopping lists for the active game, with the aggregate list first.

### `shoppingListLoadingState`

Whether the `shoppingLists` are 'loading' (waiting for the API call to resolve), 'done' (when the API call is finished), or 'error' (when the API call has returned or thrown an error).

### `performShoppingListCreate`

A function that creates a shopping list for the authenticated user and updates the aggregate list to reflect the change, also encompassing error handling logic. The function takes 3 arguments:

* `title`: the title of the new list. Must be unique, contain only alphanumeric characters and spaces, and cannot be any form of "Master". Will be reformatted on the backend to use title casing
* `callbacks`: an optional object with callbacks for each possible API response. Possible keys are:
  * `onSuccess`: called when the API call returns a 201 response
  * `onNotFound`: called when the game the shopping list is being created for has been previously destroyed
  * `onUnauthorized`: called when the API returns a 401 response
  * `onUnprocessableEntity`: called when the shopping list can't be created due to validation errors
  * `onInternalServerError`: called when there is a 500 error or other unexpected error, or when there is an error in the response handler

### `performShoppingListUpdate`

A function that updates the list specified through the API, also encompassing error handling logic. The function takes 4 arguments:

* `listId`: the ID (primary key in the database) of the list to be updated
* `newTitle`: the new title of the list taken from the form the user submitted
* `callbacks`: an optional object with callbacks for each possible API response. Possible keys are:
  * `onSuccess`: called when the API call returns a 200 response
  * `onNotFound`: called when the shopping list being updated has been previously destroyed
  * `onUnauthorized`: called when the API returns a 401 response
  * `onUnprocessableEntity`: called when the shopping list can't be updated due to validation errors
  * `onInternalServerError`: called when there is a 500 error or other unexpected error (including 405 Method Not Allowed), or when there is an error in the response handler

### `performShoppingListDestroy`

A function that deletes the list specified through the API, also encompassing error handling logic. The function takes 3 arguments:

* `listId`: the ID (primary key in the database) of the list to be updated
* `callbacks`: an optional object with callbacks for each possible API response. Possible keys are:
  * `onSuccess`: called when the API call returns a 200 or 204 response
  * `onNotFound`: called when the shopping list being destroyed has already been previously destroyed
  * `onUnauthorized`: called when the API returns a 401 response
  * `onInternalServerError`: called when there is a 500 error or other unexpected error (including 405 Method Not Allowed), or when there is an error in the response handler

### `performShoppingListItemCreate`

A function that creates a shopping list item on the list specified (or combines the new attributes given with an existing item with the same description), also encompassing error handling logic. This will also cause the aggregate list to update. The function takes four arguments:

* `listId`: the ID of the shopping list the item should be added to
* `attrs`: The attributes the item should be created with. Attributes can include:
  * `description` (string, required, case-insensitively unique per list)
  * `quantity` (integer, required, must be greater than 0)
  * `notes` (any notes associated with other item - will be combined with existing notes if the item is combined with another existing item)
* `callbacks`: an optional object with callbacks for each possible API response. Possible keys are:
  * `onSuccess`: called when the API call returns a 200 or 204 response
  * `onNotFound`: called when the shopping list being destroyed has already been previously destroyed
  * `onUnauthorized`: called when the API returns a 401 response
  * `onUnprocessableEntity`: called when the API returns a 422 response caused by validation errors
  * `onInternalServerError`: called when there is a 500 error or other unexpected error (including 405 Method Not Allowed), or when there is an error in the response handler

### `performShoppingListItemUpdate`

A function that updates the specified shopping list item, also encompassing error handling logic. This will also cause the aggregate list to update. The function takes four arguments:

* `itemId`: the ID of the item to be updated
* `attrs`: the attributes to be updated on the list item. Cannot update item `description`. Attributes can include:
  * `quantity` (integer, greater than 0)
  * `notes` (string)
* `showFlashOnSuccess`: whether a successful API call should result in a flash message being displayed (the flash message will always be displayed on failure)
* `callbacks`: an optional object with callbacks for each possible API response. Possible keys are:
  * `onSuccess`: called when the API call returns a 200 or 204 response
  * `onNotFound`: called when the shopping list being destroyed has already been previously destroyed
  * `onUnauthorized`: called when the API returns a 401 response
  * `onUnprocessableEntity`: called when the API returns a 422 response caused by validation errors
  * `onInternalServerError`: called when there is a 500 error or other unexpected error (including 405 Method Not Allowed), or when there is an error in the response handler

### `performShoppingListItemDestroy`

A function that destroys the specified shopping list item, also encompassing error handling logic. This also updates the aggregate list to reflect the change. The function takes three arguments:

* `itemId`: the ID of the item to be destroyed
* `callbacks`: an optional object with callbacks for each possible API response. Possible keys are:
  * `onSuccess`: called when the API call returns a 200 or 204 response
  * `onNotFound`: called when the shopping list being destroyed has already been previously destroyed
  * `onUnauthorized`: called when the API returns a 401 response
  * `onInternalServerError`: called when there is a 500 error or other unexpected error (including 405 Method Not Allowed), or when there is an error in the response handler

### `listItemEditFormProps`

The props to be passed to the `ShoppingListItemEditForm` component if it is displayed.

### `listItemEditFormVisible`

Whether the `ShoppingListItemEditForm` component should be visible.

### `setListItemEditFormProps`

A setter function for shopping list item edit form props. Takes an object as an argument. The object should represent valid props for a `ShoppingListItemEditForm` (as indicated by [the component's PropTypes](/src/components/shoppingListItemEditForm/shoppingListItemEditForm.js)).

### `setListItemEditFormVisible`

A setter function to indicate whether the `ShoppingListEditForm` component should be displayed or hidden. Takes a single boolean argument.

## Testing Components in Storybook

The `ShoppingListsContext` is a little easier to work with in Storybook than the `AppContext`. While it still has an `overrideValues` prop, it isn't needed quite as much to make the basics work and you should only need it to, for example, set the loading state to 'loading' if a story needs to display that state. The rest of the testing can mostly be handled by mocking the API calls the provider makes using `msw`. Remember that the `ShoppingListsProvider` component needs to be wrapped in a `AppProvider` and a `GamesProvider`, which will require override values.

**There are significant limitations to this approach.** Because MSW mocks do not have access to the internal state of the provider, mocked responses have to be based only on data included in the request itself or the initial values of the shopping lists and their items. For this reason, behaviour of components in Storybook should be considered primarily illustrative of component behaviour. Storybook cannot be used for testing edge cases and the components will behave strangely if you do anything too complicated.

