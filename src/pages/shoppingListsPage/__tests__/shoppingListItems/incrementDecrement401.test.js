import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
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

describe('Incrementing a shopping list item when the server returns 404', () => {
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
      return res(
        ctx.status(401),
        ctx.json({
          errors: ['Google OAuth token validation failed']
        })
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

  describe('incrementing', () => {
    it('returns to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies()

      // We're going to increment an item on the 'Lakeview Manor' list
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      fireEvent.click(listTitleEl)

      // The list item we're going for is titled 'Ingredients with "Frenzy"
      // property'. Its initial quantity is 4.
      const itemDescEl = await within(listEl).findByText(/frenzy/i)
      const itemEl = itemDescEl.closest('.root')
      const incrementer = await within(itemEl).findByTestId('incrementer')

      fireEvent.click(incrementer)

      // It should redirect the user back to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('decrementing', () => {
    it('returns to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies()

      // We're going to increment an item on the 'Lakeview Manor' list
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      fireEvent.click(listTitleEl)

      // The list item we're going for is titled 'Ingredients with "Frenzy"
      // property'. Its initial quantity is 4.
      const itemDescEl = await within(listEl).findByText(/frenzy/i)
      const itemEl = itemDescEl.closest('.root')
      const decrementer = await within(itemEl).findByTestId('decrementer')

      fireEvent.click(decrementer)

      // It should show the original quantity value
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })
})
