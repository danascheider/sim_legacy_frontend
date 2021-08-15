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
import { InventoryListsProvider } from '../../../contexts/inventoryListsContext'
import { profileData, games, allInventoryLists } from '../../../sharedTestData'
import InventoryPage from './../inventoryPage'

describe('Destroying a inventory list', () => {
  let component

  const renderComponentWithMockCookies = (gameId = null, allGames = games) => {
    const route = gameId ? `/dashboard/inventory?game_id=${gameId}` : '/dashboard/inventory'

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games: allGames, gameLoadingState: 'done' }} >
            <InventoryListsProvider>
              <InventoryPage />
            </InventoryListsProvider>
          </GamesProvider>
        </AppProvider>
      </CookiesProvider>,
      { route }
    )
  }

  const sharedHandlers = [
    rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const lists = allInventoryLists.filter(list => list.game_id === gameId)

      return res(
        ctx.status(200),
        ctx.json(lists)
      )
    })
  ]

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when there is only one regular list', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
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

    afterEach(() => confirm.mockRestore())
    afterAll(() => server.close())

    it('prompts the user and removes the list and aggregate list', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the list on the page and locate its destroy icon
      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = within(listEl).getByTestId('delete-inventory-list')

      fireEvent.click(deleteIcon)

      // The user should be prompted to confirm that they want to destroy the
      // list
      expect(confirm).toHaveBeenCalled()

      // Both the list and aggregate list should be removed
      await waitFor(() => expect(listEl).not.toBeInTheDocument())
      expect(screen.queryByText('All Items')).not.toBeInTheDocument()

      // There should be a flash message indicating that the list and its aggregate list
      // have both been destroyed
      await waitFor(() => expect(screen.queryByText(/inventory list has been deleted/i)).toBeVisible())
      expect(screen.queryByText(/"All Items" list has been deleted/i)).toBeVisible()
    })
  })

  describe('when there are multiple regular lists and no list items', () => {
    const handlers = [
      rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
        const lists = [
          { ...allInventoryLists[0], list_items: [] },
          { ...allInventoryLists[1], list_items: [] },
          { ...allInventoryLists[2], list_items: [] }
        ]
        
        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ ...allInventoryLists[0], list_items: [] })
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

    afterEach(() => confirm.mockRestore())

    afterAll(() => server.close())

    it('removes the list but not the aggregate list', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the list on the page and locate its destroy icon
      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = within(listEl).getByTestId('delete-inventory-list')

      fireEvent.click(deleteIcon)

      // The user should be prompted to confirm that they want to destroy the
      // list
      expect(confirm).toHaveBeenCalled()

      // The list should be removed
      await waitFor(() => expect(listEl).not.toBeInTheDocument())

      // The aggregate list should still be visible on the page
      await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())

      // There should be a flash message indicating the list was deleted
      await waitFor(() => expect(screen.queryByText(/inventory list has been deleted/i)).toBeVisible())
    })
  })

  describe('when there are multiple regular lists with list items', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/inventory_lists/${allInventoryLists[1].id}`, (req, res, ctx) => {
        const newListItems = [
          {
            id: allInventoryLists[0].list_items[0].id,
            list_id: allInventoryLists[0].id,
            description: 'Ebony sword',
            quantity: 1,
            notes: 'notes 2'
          }
        ]

        return res(
          ctx.status(200),
          ctx.json({ ...allInventoryLists[0], list_items: newListItems })
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

    afterEach(() => confirm.mockRestore())

    afterAll(() => server.close())

    it('removes the list and updates the aggregate list items to match the response', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the regular list and the all-items list by first locating their
      // title elements and then finding the containers
      const listTitle = await screen.findByText('Lakeview Manor')
      const allItemsTitle = screen.getByText('All Items')

      const listEl = listTitle.closest('.root')
      const allItemsEl = allItemsTitle.closest('.root')

      // Get the destroy icon for the regular list and click it
      const deleteIcon = within(listEl).getByTestId('delete-inventory-list')

      fireEvent.click(deleteIcon)

      // The user should be asked to confirm they want to delete the list
      expect(confirm).toHaveBeenCalled()

      // The list should be removed
      await waitFor(() => expect(listEl).not.toBeInTheDocument())

      // The aggregate list should still be visible on the page
      expect(allItemsEl).toBeVisible()

      // There should be a flash message indicating the list was deleted
      await waitFor(() => expect(screen.queryByText(/inventory list has been deleted/i)).toBeVisible())

      // Expand the aggregate list so its list items are visible
      fireEvent.click(allItemsTitle)

      // Find the relevant list items and check that the quantity has been reduced
      // from 2 to 1 in accordance with the API response
      const listItemTitle = await within(allItemsEl).findByText(/ebony sword/i)
      const listItemEl = listItemTitle.closest('.root')

      await waitFor(() => expect(within(listItemEl).queryByText('2')).not.toBeInTheDocument())
      expect(within(listItemEl).queryByText('1')).toBeVisible()
    })
  })

  describe('when the server returns a 404 error', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
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

    afterEach(() => confirm.mockRestore())
    afterAll(() => server.close())

    it("doesn't remove the list and displays an error message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the list on the page and locate its destroy icon
      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = within(listEl).getByTestId('delete-inventory-list')

      fireEvent.click(deleteIcon)

      // The user should be prompted to confirm that they want to destroy the
      // list
      expect(confirm).toHaveBeenCalled()

      // The list should not be removed from the page
      await waitFor(() => expect(listEl).toBeVisible())

      // There should be a flash error message explaining what happened
      await waitFor(() => expect(screen.queryByText(/couldn't find/i)).toBeVisible())
    })
  })

  describe('when the server returns a 500 error', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
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

    afterEach(() => confirm.mockRestore())

    afterAll(() => server.close())

    it("doesn't remove the list and displays an error message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      component = renderComponentWithMockCookies(games[0].id)

      // Find the list on the page and locate its destroy icon
      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = within(listEl).getByTestId('delete-inventory-list')

      fireEvent.click(deleteIcon)

      // The user should be prompted to confirm that they want to destroy the
      // list
      expect(confirm).toHaveBeenCalled()

      // The list should not be removed from the page
      await waitFor(() => expect(listEl).toBeVisible())

      // There should be a flash error message
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
    })
  })

  describe('when the server indicates the user has been logged out', () => {
    const handlers = [
      rest.delete(`${backendBaseUri}/inventory_lists/:id`, (req, res, ctx) => {
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
    
    afterEach(() => confirm.mockRestore())

    afterAll(() => server.close())

    it('redirects the user to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies(games[0].id)

      component = renderComponentWithMockCookies(games[0].id)

      // Find the list on the page and locate its destroy icon
      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon = within(listEl).getByTestId('delete-inventory-list')

      fireEvent.click(deleteIcon)

      // The user should be prompted to confirm that they want to destroy the
      // list
      expect(confirm).toHaveBeenCalled()

      // The user should be redirected to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('cancelling deletion of an inventory list', () => {
    let confirm
    
    const server = setupServer.apply(null, sharedHandlers)

    beforeAll(() => server.listen())

    beforeEach(() => {
      server.resetHandlers()
      confirm = jest.spyOn(window, 'confirm').mockImplementation(() => false)
    })

    afterEach(() => confirm.mockRestore())
    afterAll(() => server.close())
    
    it("doesn't remove the list and displays a message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the list on the page and locate its destroy icon
      const listTitle = await screen.findByText('Lakeview Manor')
      const listEl = listTitle.closest('.root')
      const deleteIcon =within(listEl).getByTestId('delete-inventory-list')

      fireEvent.click(deleteIcon)

      // The user should be prompted to confirm that they want to destroy the
      // list
      expect(confirm).toHaveBeenCalled()

      // When the user cancels, the list should not be removed
      await waitFor(() => expect(listEl).toBeVisible())

      // There should be a flash info message indicating the list was not deleted
      await waitFor(() => expect(screen.queryByText(/not deleted/i)).toBeVisible())
    })
  })
})
