# InventoryListsContext

The `InventoryListsContext` is used to fetch all the relevant shopping lists when the shopping list page renders. It uses some similar patterns to the `AppContext`, including the use of the `overrideValue` prop to set the value of the provider in Storybook.

The `InventoryListsContext` is a consumer of the `AppContext` and the `GamesContext`, implying that the `InventoryListsProvider` can only be rendered inside both an `AppProvider` and a `GamesProvider`. You will see an error to this effect if you try to implement it another way. From the `AppProvider`, the context takes the `token` (which it needs to make its API calls) as well as the `logOutAndRedirect` function. The latter is used in the event an API call returns status 401 and the user needs to be logged out. From the `GamesProvider`, the context takes the list of the user's games, which is used to determine how to populate the dropdown on the inventory lists page and which inventory lists to display.

On render, the `InventoryListsProvider` fetches all the inventory lists for the active game (i.e., the one specifed by the `game_id` query string param). 

## Value

### `inventory_lists`

The array of all inventory lists for the active game, aggregate list first.

### `inventoryListLoadingState`

Whether the `inventoryLists` are 'loading' (waiting for the API call to resolve), 'done' (when the API call is finished), or 'error' (when the API call has returned or thrown an error).

## Testing Components in Storybook

The `InventoryListsContext` is a little easier to work with in Storybook than the `AppContext`. While it still has an `overrideValues` prop, it isn't needed quite as much to make the basics work and you should only need it to, for example, set the loading state to 'loading' if a story needs to display that state. The rest of the testing can mostly be handled by mocking the API calls the provider makes using `msw`. Remember that the `InventoryListsProvider` component needs to be wrapped in a `AppProvider` and a `GamesProvider`, which will require override values.

**There are significant limitations to this approach.** Because MSW mocks do not have access to the internal state of the provider, mocked responses have to be based only on data included in the request itself or the initial values of the shopping lists and their items. For this reason, behaviour of components in Storybook should be considered primarily illustrative of component behaviour. Storybook cannot be used for testing edge cases and the components will behave strangely if you do anything too complicated.
