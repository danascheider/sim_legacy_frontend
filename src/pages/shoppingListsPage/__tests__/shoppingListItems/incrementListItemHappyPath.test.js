import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../../setupTests'
import { backendBaseUri } from '../../../../utils/config'
import { AppProvider } from '../../../../contexts/appContext'
import { GamesProvider } from '../../../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../../../contexts/shoppingListsContext'
import { profileData, games, allShoppingLists } from '../../../../sharedTestData'
import ShoppingListsPage from './../../shoppingListsPage'

describe('Incrementing a shopping list item - happy path', () => {
  let component

  const renderComponentWithMockCookies = () => {
    const route = `/dashboard/shopping_lists?game_id=${games[0].id}`

    const shoppingLists = allShoppingLists.filter(list => list.game_id === games[0].id)

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }} >
            <ShoppingListsProvider overrideValue={{ shoppingLists, shoppingListLoadingState: 'done' }}>
              <ShoppingListsPage />
            </ShoppingListsProvider>
          </GamesProvider>
        </AppProvider>
      </CookiesProvider>,
      { route }
    )
  }

  const server = setupServer(
    rest.patch(`${backendBaseUri}/shopping_list_items/3`, (req, res, ctx) => {
      const listItem = allShoppingLists[1].list_items[1]
      const aggListItem = allShoppingLists[0].list_items.find(item => item.description.toLowerCase() === listItem.description.toLowerCase())
      const quantity = req.body.shopping_list_item.quantity
      const deltaQty = quantity - listItem.quantity

      const returnJson = [
        {
          ...aggListItem,
          quantity: aggListItem.quantity + deltaQty
        },
        {
          ...listItem,
          quantity: quantity
        }
      ]

      return res(
        ctx.status(200),
        ctx.json(returnJson)
      )
    })
  )

  beforeAll(() => server.listen())

  beforeEach(() => {
    cleanCookies()
    server.resetHandlers()
  })

  afterEach(() => component.unmount())
  afterAll(() => server.close())

  it('updates the requested item and the aggregate list', async () => {
    component = renderComponentWithMockCookies()

    // We're going to increment an item on the 'Lakeview Manor' list
    const listTitleEl = await screen.findByText('Lakeview Manor')
    const listEl = listTitleEl.closest('.root')

    fireEvent.click(listTitleEl)

    // The list item we're going for is titled 'Ingredients with "Frenzy"
    // property'. Its initial quantity is 4.
    const itemDescEl = await within(listEl).findByText(/frenzy/i)
    const itemEl = itemDescEl.closest('.root')
    const incrementer = within(itemEl).getByTestId('incrementer')

    fireEvent.click(incrementer)

    // It should increment the value shown on the list item
    await waitFor(() => expect(within(itemEl).queryByText('5')).toBeVisible())

    // Now find the corresponding item on the aggregate list. Start by
    // finding the list itself.
    const aggListTitleEl = screen.getByText('All Items')
    const aggListEl = aggListTitleEl.closest('.root')

    // Expand the list
    fireEvent.click(aggListTitleEl)

    // Then find the corresponding item
    const aggListItemDescEl = await within(aggListEl).findByText(/frenzy/i)
    const aggListItemEl = aggListItemDescEl.closest('.root')

    // Now we need to check its quantity. The quantity of this item
    // on the aggregate list is the same as the quantity on the regular
    // list, so the quantity we're looking for is '5' here as well.
    await waitFor(() => expect(within(aggListItemEl).queryByText('5')).toBeVisible())
  })
})
