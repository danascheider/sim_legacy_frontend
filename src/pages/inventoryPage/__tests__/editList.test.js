import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  waitFor,
  screen,
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

describe('Editing a inventory list', () => {
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

  fdescribe('showing and hiding the form', () => {
    const server = setupServer.apply(null, sharedHandlers)

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    fit('displays without toggling the list items when you click the edit icon', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the inventory list we'll edit
      const list = allInventoryLists.filter(list => list.game_id === games[0].id)[1]

      // Find the inventory list component for this list and click its edit icon
      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = within(listEl).getByTestId('edit-inventory-list')

      fireEvent.click(editIcon)

      // It should not display the list items when you click on it
      await waitFor(() => expect(within(listEl).queryByText(list.list_items[0].description)).not.toBeVisible())
      expect(within(listEl).queryByText(list.list_items[1].description)).not.toBeVisible()

      // There should be an input with the list's title as its `value`
      await waitFor(() => expect(within(listEl).queryByDisplayValue(list.title)).toBeVisible())
    })

    it('hides the form again when you click outside', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the shopping list we'll edit
      const list = allShoppingLists.filter(list => list.game_id === games[0].id)[1]

      // Find the shopping list component for this list and click its edit icon
      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = within(listEl).getByTestId('edit-shopping-list')

      fireEvent.click(editIcon)

      // The there should be a form with an input with the list's title as its `value`
      const input = await within(listEl).queryByDisplayValue(list.title)

      fireEvent.click(listEl) // click could be anywhere but you have to specify

      // The input should no longer be present, but the list should
      await waitFor(() => expect(input).not.toBeInTheDocument())
      expect(listEl).toBeInTheDocument()
    })
  })

  describe('when all goes as planned', () => {
    const handlers = [
      rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        const listId = parseInt(req.params.id)
        const list = allShoppingLists.find(l => l.id === listId)
        const title = req.body.shopping_list.title

        const respBody = { ...list, title }

        return res(
          ctx.status(200),
          ctx.json({ ...list, title })
        )
      }),
      ...sharedHandlers
    ]

    const server = setupServer.apply(null, handlers)

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('edits the shopping list and hides the form', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the shopping list we'll edit
      const list = allShoppingLists.filter(list => list.game_id === games[0].id)[1]

      // Find the shopping list component for this list and click its edit icon
      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = within(listEl).getByTestId('edit-shopping-list')

      fireEvent.click(editIcon)

      // Find the title input and the `form` it is part of
      const input = await within(listEl).findByDisplayValue(list.title)
      const form = input.closest('.root')

      // Fill out the title input and submit the form
      fireEvent.change(input, { target: { value: 'Honeyside' } })
      fireEvent.submit(form)

      // The input should be hidden and the new title should be visible
      await waitFor(() => expect(input).not.toBeInTheDocument())
      expect(listEl).toHaveTextContent(/Honeyside/)
    })
  })

  describe('when the server returns a 404', () => {
    const handlers = [
      rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(404),
        )
      }),
      ...sharedHandlers
    ]

    const server = setupServer.apply(null, handlers)

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("doesn't change the list name and renders an error message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the shopping list we'll edit
      const list = allShoppingLists.filter(list => list.game_id === games[0].id)[1]

      // Find the shopping list component for this list and click its edit icon
      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = within(listEl).getByTestId('edit-shopping-list')

      fireEvent.click(editIcon)

      // Find the title input and the `form` it is part of
      const input = await within(listEl).findByDisplayValue(list.title)
      const form = input.closest('.root')

      // Fill out the title input and submit the form
      fireEvent.change(input, { target: { value: 'Honeyside' } })
      fireEvent.submit(form)

      // The input should be hidden
      await waitFor(() => expect(input).not.toBeInTheDocument())

      // The title should not be updated
      await waitFor(() => expect(listEl).not.toHaveTextContent(/Honeyside/))

      // The flash error message should be visible
      await waitFor(() => expect(screen.queryByText(/could not be found/i)).toBeVisible())
    })
  })

  describe('when the server returns a 422', () => {
    const handlers = [
      rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            errors: ['Title must be unique per game']
          })
        )
      }),
      ...sharedHandlers
    ]

    const server = setupServer.apply(null, handlers)

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("doesn't change the list name and renders an error message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the shopping list we'll edit
      const gameLists = allShoppingLists.filter(list => list.game_id === games[0].id)
      const list = gameLists[1]

      // Find the shopping list component for this list and click its edit icon
      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = within(listEl).getByTestId('edit-shopping-list')

      fireEvent.click(editIcon)

      // Find the title input and the `form` it is part of
      const input = await within(listEl).findByDisplayValue(list.title)
      const form = input.closest('.root')

      // Fill out the title input and submit the form
      fireEvent.change(input, { target: { value: 'Honeyside' } })
      fireEvent.submit(form)

      // The input and form should be hidden
      await waitFor(() => expect(input).not.toBeInTheDocument())

      // The title should not be updated in the view
      await waitFor(() => expect(listEl).not.toHaveTextContent(gameLists[2].title))

      // There should be a flash error message with the validation errors
      await waitFor(() => expect(screen.queryByText(/title must be unique per game/i)).toBeVisible())
    })

  })

  describe('when the server returns a 500', () => {
    const handlers = [
      rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            errors: ['Something went horribly wrong']
          })
        )
      }),
      ...sharedHandlers
    ]

    const server = setupServer.apply(null, handlers)

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("doesn't change the list name and renders an error message", async () => {
      component = renderComponentWithMockCookies(games[0].id)

      // Find the shopping list we'll edit
      const list = allShoppingLists.filter(list => list.game_id === games[0].id)[1]

      // Find the shopping list component for this list and click its edit icon
      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = within(listEl).getByTestId('edit-shopping-list')

      fireEvent.click(editIcon)

      // Find the title input and the `form` it is part of
      const input = await within(listEl).findByDisplayValue(list.title)
      const form = input.closest('.root')

      // Fill out the title input and submit the form
      fireEvent.change(input, { target: { value: 'Honeyside' } })
      fireEvent.submit(form)

      // The input and form should be hidden
      await waitFor(() => expect(input).not.toBeInTheDocument())

      // The title should not be updated
      await waitFor(() => expect(listEl).not.toHaveTextContent(/Honeyside/))

      // There should be a flash error message explaining what happened
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
    })
  })

  describe('when the response indicates the user has been logged out', () => {
    const handlers = [
      rest.patch(`${backendBaseUri}/shopping_lists/:id`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            errors: ['Google OAuth token validation failed']
          })
        )
      }),
      ...sharedHandlers
    ]

    const server = setupServer.apply(null, handlers)

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies(games[0].id)

      // Find the shopping list we'll edit
      const list = allShoppingLists.filter(list => list.game_id === games[0].id)[1]

      // Find the shopping list component for this list and click its edit icon
      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = within(listEl).getByTestId('edit-shopping-list')

      fireEvent.click(editIcon)

      // Find the title input and the `form` it is part of
      const input = await within(listEl).findByDisplayValue(list.title)
      const form = input.closest('.root')

      // Fill out the title input and submit the form
      fireEvent.change(input, { target: { value: 'Honeyside' } })
      fireEvent.submit(form)

      // The user should be redirected to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })
})
