import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
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

  describe('when there are multiple regular lists with list items', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/shopping_lists/${allShoppingLists[1].id}`, (req, res, ctx) => {
        const newListItems = [
          {
            id: allShoppingLists[0].list_items[0].id,
            list_id: allShoppingLists[0].id,
            description: 'Ebony sword',
            quantity: 1,
            notes: 'notes 2'
          }
        ]

        return res(
          ctx.status(200),
          ctx.json({ ...allShoppingLists[0], list_items: newListItems })
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

    it('removes the list and updates the aggregate list items to match the response', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      const listTitle = await screen.findByText('Lakeview Manor')
      const allItemsTitle = await screen.findByText('All Items')

      const listEl = listTitle.closest('.root')
      const allItemsEl = allItemsTitle.closest('.root')

      const deleteIcon = await within(listEl).findByTestId('delete-shopping-list')

      fireEvent.click(deleteIcon)

      expect(confirm).toHaveBeenCalled()

      await waitForElementToBeRemoved(listEl)
      expect(listEl).not.toBeInTheDocument()
      
      await waitFor(() => expect(allItemsEl).toBeVisible())
      await waitFor(() => expect(screen.queryByText(/shopping list has been deleted/i)).toBeVisible())

      fireEvent.click(allItemsTitle)

      const listItemTitle = await within(allItemsEl).findByText(/ebony sword/i)
      const listItemEl = listItemTitle.closest('.root')

      await waitFor(() => expect(within(listItemEl).queryByText('2')).not.toBeInTheDocument())
      await waitFor(() => expect(within(listItemEl).queryByText('1')).toBeVisible())
    })
  })

  describe('when the server returns a 404 error', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(404)
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

    it("doesn't remove the list and displays an error message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = await within(listEl).findByTestId('delete-shopping-list')

      fireEvent.click(deleteIcon)

      expect(confirm).toHaveBeenCalled()

      await waitFor(() => expect(listEl).toBeVisible())

      await waitFor(() => expect(screen.queryByText(/couldn't find/i)).toBeVisible())
    })
  })

  describe('when the server returns a 500 error', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ errors: ['Something went horribly wrong'] })
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

    it("doesn't remove the list and displays an error message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = await within(listEl).findByTestId('delete-shopping-list')

      fireEvent.click(deleteIcon)

      expect(confirm).toHaveBeenCalled()

      await waitFor(() => expect(listEl).toBeVisible())
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
    })
  })

  describe('when the server indicates the user has been logged out', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation failed'] })
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

    it("doesn't remove the list and displays an error message", async () => {
      const { history } = component = renderComponentWithMockCookies(games[0].id)

      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = await within(listEl).findByTestId('delete-shopping-list')

      fireEvent.click(deleteIcon)

      expect(confirm).toHaveBeenCalled()

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
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
  // - When the server returns a 401 unauthorized
  //   - Redirects to the login page
})
