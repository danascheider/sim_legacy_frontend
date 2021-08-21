# InventoryListsContext

The `InventoryListsContext` is used to fetch all the relevant shopping lists when the shopping list page renders. It uses some similar patterns to the `AppContext`, including the use of the `overrideValue` prop to set the value of the provider in Storybook.

The `InventoryListsContext` is a consumer of the `AppContext` and the `GamesContext`, implying that the `InventoryListsProvider` can only be rendered inside both an `AppProvider` and a `GamesProvider`. You will see an error to this effect if you try to implement it another way. From the `AppProvider`, the context takes the `token` (which it needs to make its API calls) as well as the `logOutAndRedirect` function. The latter is used in the event an API call returns status 401 and the user needs to be logged out. From the `GamesProvider`, the context takes the list of the user's games, which is used to determine how to populate the dropdown on the inventory lists page and which inventory lists to display.

On render, the `InventoryListsProvider` fetches all the inventory lists for the active game (i.e., the one specifed by the `game_id` query string param). 

## Value

### `inventory_lists`

The array of all inventory lists for the active game, aggregate list first.

### `inventoryListLoadingState`

Whether the `inventoryLists` are 'loading' (waiting for the API call to resolve), 'done' (when the API call is finished), or 'error' (when the API call has returned or thrown an error).

### `performInventoryListCreate`

A function that takes a `title` and `callbacks` object and creates an inventory list with that title for the active game, calling the appropriate callback when the request has completed.

The `callbacks` object can contain the following callbacks:

* `onSuccess`: called after a 200-range response has been handled successfully
* `onNotFound`: called when the game the user requests to create a list for is not found or does not belong to the authenticated user
* `onUnauthorized`: called when the request returns a 401 response
* `onUnprocessableEntity`: called when the title the user submits is invalid or not unique
* `onInternalServerError`: called when the server returns a 500-range response or there is an unexpected error while handling the response

### `performInventoryListUpdate`

A function that takes the `listId` of the list to be updated, a new `title`, and a `callbacks` object and updates the title of the indicated list to the new title, calling the appropriate callback when the request has completed.

The `callbacks` object can contain the following callbacks:

* `onSuccess`: called after a 200-range response has been handled successfully
* `onNotFound`: called when the list the user wants to update is not found or does not belong to the authenticated user
* `onUnauthorized`: called when the request returns a 401 response
* `onUnprocessableEntity`: called when the title the user submits is invalid or not unique
* `onInternalServerError`: called when the server returns a 500-range response or there is an unexpected error while handling the response

### `performInventoryListDestroy`

A function that takes the `listId` of the list to be destroyed and a `callbacks` object and destroys the requested list, calling the appropriate callback when the request has completed.

The `callbacks` object can contain the following callbacks:

* `onSuccess`: called after a 200-range response has been handled successfully (possible responses are 200 and 204)
* `onNotFound`: called when the list requested is not found or does not belong to the authenticated user
* `onUnauthorized`: called when the request returns a 401 response
* `onInternalServerError`: called when the server returns a 500-range response or there is an unexpected error while handling the response

### `performInventoryListItemCreate`

A function that takes a `listId`, list item `attrs`, and a `callbacks` object and creates an inventory list item with that title on the list indicated, calling the appropriate callback when the request has completed. The aggregate list will also be updated. If `unit_weight` is set on the new list item, all matching items belonging to the same game will have their `unit_weight` updated to the same value and will be returned with the response.

Valid `attrs` include the following:

* `description` (string, required)
* `quantity` (integer greater than 0, required)
* `unit_weight` (number with up to one decimal place, can be null)
* `notes` (string)

The `callbacks` object can contain the following callbacks:

* `onSuccess`: called after a 200-range response has been handled successfully (possible responses are 200 and 201)
* `onNotFound`: called when the list the user wants to add the item to is not found or does not belong to the authenticated user
* `onUnauthorized`: called when the request returns a 401 response
* `onUnprocessableEntity`: called when the attributes the user submits are invalid or not unique
* `onInternalServerError`: called when the server returns a 500-range response or there is an unexpected error while handling the response

### `performInventoryListItemUpdate`

A function that takes an `itemId`, list item `attrs`, and a `callbacks` object and updates an inventory list item with the given ID, calling the appropriate callback when the request has completed. The aggregate list will also be updated. If `unit_weight` is set to a non-`null` value, unit weight will also be updated for any matching (by description) list item belonging to the same game. The response from the API returns all list items that were updated while executing the request.

Valid `attrs` include the following:

* `description` (string, required)
* `quantity` (integer greater than 0, required)
* `unit_weight` (number with up to one decimal place, can be null)
* `notes` (string)

The `callbacks` object can contain the following callbacks:

* `onSuccess`: called after a 200 response has been handled successfully
* `onNotFound`: called when the list the user wants to add the item to is not found or does not belong to the authenticated user
* `onUnauthorized`: called when the request returns a 401 response
* `onUnprocessableEntity`: called when the attributes the user submits are invalid
* `onInternalServerError`: called when the server returns a 500-range response or there is an unexpected error while handling the response

### `performInventoryListItemDestroy`

A function that takes the `itemId` of the list item to be destroyed and a `callbacks` object and destroys the requested list item, calling the appropriate callback when the request has completed. The corresponding aggregate list item will also be updated or destroyed on the backend while handling this request.

The `callbacks` object can contain the following callbacks:

* `onSuccess`: called after a 200-range response has been handled successfully (possible responses are 200 and 204)
* `onNotFound`: called when the list item requested is not found or does not belong to the authenticated user
* `onUnauthorized`: called when the request returns a 401 response
* `onInternalServerError`: called when the server returns a 500-range response or there is an unexpected error while handling the response

## Testing Components in Storybook

The `InventoryListsContext` is a little easier to work with in Storybook than the `AppContext`. While it still has an `overrideValues` prop, it isn't needed quite as much to make the basics work and you should only need it to, for example, set the loading state to 'loading' if a story needs to display that state. The rest of the testing can mostly be handled by mocking the API calls the provider makes using `msw`. Remember that the `InventoryListsProvider` component needs to be wrapped in a `AppProvider` and a `GamesProvider`, which will require override values.

**There are significant limitations to this approach.** Because MSW mocks do not have access to the internal state of the provider, mocked responses have to be based only on data included in the request itself or the initial values of the shopping lists and their items. For this reason, behaviour of components in Storybook should be considered primarily illustrative of component behaviour. Storybook cannot be used for testing edge cases and the components will behave strangely if you do anything too complicated.
