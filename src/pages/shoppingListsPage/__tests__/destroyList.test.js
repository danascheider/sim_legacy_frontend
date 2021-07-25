import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react-dom/test-utils'
import {
  waitFor,
  screen,
  waitForElementToBeRemoved,
  fireEvent
} from '@testing-library/react'
import { within } from '@testing-library/dom'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../setupTests'
import { backendBaseUri } from '../../../utils/config'
import { AppProvider } from '../../../contexts/appContext'
import { GamesProvider } from '../../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../../contexts/shoppingListsContext'
import { profileData, games, allShoppingLists } from '../../../sharedTestData'
import ShoppingListsPage from './../shoppingListsPage'

describe('Destroying a shopping list', () => {
  let component

  const renderComponentWithMockCookies = (gameId = null, allGames = games) => {
    const route = gameId ? `/dashboard/shopping_lists?game_id=${gameId}` : '/dashboard/shopping_lists'

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games: allGames, gameLoadingState: 'done' }} >
            <ShoppingListsProvider>
              <ShoppingListsPage />
            </ShoppingListsProvider>
          </GamesProvider>
        </AppProvider>
      </CookiesProvider>,
      { route }
    )
  }

  const sharedHandlers = [
    rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const lists = allShoppingLists.filter(list => list.game_id === gameId)

      return res(
        ctx.status(200),
        ctx.json(lists)
      )
    })
  ]

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when there is one regular list', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(204)
        )
      }),
      ...sharedHandlers
    ]
    
    const server = setupServer.apply(null, handlers)

    let confirm

    beforeAll(() => server.listen())

    beforeEach(() => {
      server.resetHandlers()

      // For these tests, the user will click "OK" each time
      // they are asked.
      confirm = jest.spyOn(window, 'confirm').mockImplementation(() => true)
    })

    afterAll(() => server.close())

    it('prompts the user and removes the list and aggregate list', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = await within(listEl).findByTestId('delete-shopping-list')

      fireEvent.click(deleteIcon)

      expect(confirm).toHaveBeenCalled()

      await waitForElementToBeRemoved(listEl)
      expect(listEl).not.toBeInTheDocument()
      expect(screen.queryByText(/all items/i)).not.toBeInTheDocument()

      await waitFor(() => expect(screen.queryByText(/shopping list has been deleted/i)).toBeVisible())
      await waitFor(() => expect(screen.queryByText(/aggregate list has been deleted/i)).toBeVisible())
    })
  })

  describe('when there are multiple regular lists and no list items', () => {
    const handlers = [
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const lists = [
          { ...allShoppingLists[0], list_items: [] },
          { ...allShoppingLists[1], list_items: [] },
          { ...allShoppingLists[2], list_items: [] }
        ]
        
        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ ...allShoppingLists[0], list_items: [] })
        )
      })
    ]
    
    const server = setupServer.apply(null, handlers)

    let confirm

    beforeAll(() => server.listen())

    beforeEach(() => {
      server.resetHandlers()

      // For these tests, the user will click "OK" each time
      // they are asked.
      confirm = jest.spyOn(window, 'confirm').mockImplementation(() => true)
    })

    afterAll(() => server.close())

    it('removes the list but not the aggregate list', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = await within(listEl).findByTestId('delete-shopping-list')

      fireEvent.click(deleteIcon)

      expect(confirm).toHaveBeenCalled()

      await waitForElementToBeRemoved(listEl)
      expect(listEl).not.toBeInTheDocument()
      
      await waitFor(() => expect(screen.queryByText(/all items/i)).toBeVisible())

      await waitFor(() => expect(screen.queryByText(/shopping list has been deleted/i)).toBeVisible())
    })
  })

  describe('cancelling deletion of a shopping list', () => {
    const confirm = window.confirm
    
    const server = setupServer.apply(null, sharedHandlers)

    beforeAll(() => {
      server.listen()
      window.confirm = jest.fn(() => false)
    })

    beforeEach(() => server.resetHandlers())

    afterAll(() => {
      server.close()
      window.confirm = confirm
    })
    
    it("doesn't remove the list and displays a message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = await within(listEl).findByTestId('delete-shopping-list')

      fireEvent.click(deleteIcon)

      await waitFor(() => expect(listEl).toBeVisible())
      await waitFor(() => expect(screen.queryByText(/not deleted/i)).toBeVisible())
    })
  })

  // Scenarios:
  // - When there are multiple regular lists with no list items
  //   - Removes the deleted list but not the All Items list
  // - When there are multiple lists with list items (this
  //   scenario already exists in test data, so we just need
  //   to calculate the expected adjustments):
  //   - Removes the regular list but not the all items list
  //   - Adjusts the quantity of items on the all items list
  // - When the server returns a 404 list not found
  //   - Doesn't remove the list
  //   - Displays flash message
  // - When the server returns a 401 unauthorized
  //   - Redirects to the login page
  // - When the server returns a 500 internal server error
  //   - Doesn't remove the list
  //   - Displays flash message
})
