import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../setupTests'
import { backendBaseUri } from '../../../utils/config'
import { AppProvider } from '../../../contexts/appContext'
import { GamesProvider } from '../../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../../contexts/shoppingListsContext'
import { profileData, games, allShoppingLists } from '../../../sharedTestData'
import ShoppingListsPage from './../shoppingListsPage'

describe('Creating a shopping list', () => {
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

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('happy path when the game has no other lists', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const title = req.body.shopping_list.title

        const returnData = [
          {
            id: 1866,
            game_id: gameId,
            aggregate: true,
            title: 'All Items',
            list_items: []
          },
          {
            id: 1867,
            game_id: gameId,
            aggregate: false,
            title: title,
            list_items: []
          }
        ]

        return res(
          ctx.status(201),
          ctx.json(returnData)
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('creates the new shopping list and aggregate list for the active game', async () => {
      component = renderComponentWithMockCookies(games[2].id)

      // Find the shopping list create form
      const form = await screen.findByTestId('shopping-list-create-form')
      const input = await screen.findByLabelText('Title')
      const button = await screen.findByText('Create')

      fireEvent.change(input, { target: { value: 'Proudspire Manor' } })
      fireEvent.submit(form)

      // The new list should be visible on the page
      await waitFor(() => expect(screen.queryByText('Proudspire Manor')).toBeVisible())

      // The aggregate list should be visible on the page
      await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())

      // The create form should be cleared and still be enabled
      await waitFor(() => expect(input).not.toBeDisabled())
      await waitFor(() => expect(button).not.toBeDisabled())
      await waitFor(() => expect(input.value).toEqual(''))
    })
  })

  describe('happy path when the game has other lists', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const title = req.body.shopping_list.title

        return res(
          ctx.status(201),
          ctx.json({
            id: 1866,
            game_id: gameId,
            list_items: [],
            title
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('creates the new shopping list for the active game', async () => {
      component = renderComponentWithMockCookies(games[1].id)

      // Find the shopping list create form
      const form = await screen.findByTestId('shopping-list-create-form')
      const input = await screen.findByLabelText('Title')
      const button = await screen.findByText('Create')

      fireEvent.change(input, { target: { value: 'Proudspire Manor' } })
      fireEvent.submit(form)

      // The new shopping list should be visible
      await waitFor(() => expect(screen.queryByText('Proudspire Manor')).toBeVisible())

      // The input form should be cleared and not disabled
      await waitFor(() => expect(input).not.toBeDisabled())
      await waitFor(() => expect(button).not.toBeDisabled())
      await waitFor(() => expect(input.value).toEqual(''))
    })
  })

  describe('when the game is not found', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(404),
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("displays a flash error message and clears the form but doesn't disable it", async () => {
      component = renderComponentWithMockCookies()

      // Find the shopping list create form
      const form = await screen.findByTestId('shopping-list-create-form')
      const input = await screen.findByLabelText('Title')
      const button = await screen.findByText('Create')

      fireEvent.change(input, { target: { value: 'Proudspire Manor' } })
      fireEvent.submit(form)

      // There should be a flash message indicating that the game could not be found
      await waitFor(() => expect(screen.queryByText(/could not be found/i)).toBeVisible())

      // The input form should not be cleared or disabled
      await waitFor(() => expect(input).not.toBeDisabled())
      await waitFor(() => expect(button).not.toBeDisabled())
      await waitFor(() => expect(input.value).toEqual(''))
    })
  })

  describe('when the attributes are invalid', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            errors: ['Title must be unique per game']
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("displays a flash error message, doesn't create the shopping list or clear the form", async () => {
      component = renderComponentWithMockCookies()

      // Find the shopping list create form
      const form = await screen.findByTestId('shopping-list-create-form')
      const input = await screen.findByLabelText('Title')
      const button = await screen.findByText('Create')

      fireEvent.change(input, { target: { value: 'Proudspire Manor' } })
      fireEvent.submit(form)

      // There should be a flash error message with the validation errors
      await waitFor(() => expect(screen.queryByText(/title must be unique per game/i)).toBeVisible())

      // The new list should not be added to the page
      await waitFor(() => expect(screen.queryByText(/proudspire manor/i)).not.toBeInTheDocument())

      // The form should not be cleared or disabled
      await waitFor(() => expect(input).not.toBeDisabled())
      await waitFor(() => expect(button).not.toBeDisabled())
      await waitFor(() => expect(input.value).toEqual('Proudspire Manor'))
    })
  })

  describe('when there is an unexpected error', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            errors: ['Something went horribly wrong']
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("displays a flash error message and clears the form but doesn't create the shopping list", async () => {
      component = renderComponentWithMockCookies()

      // Find the shopping list create form
      const form = await screen.findByTestId('shopping-list-create-form')
      const input = await screen.findByLabelText('Title')
      const button = await screen.findByText('Create')

      fireEvent.change(input, { target: { value: 'Proudspire Manor' } })
      fireEvent.submit(form)

      // There should be a flash error message
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())

      // The new shopping list should not be added to the page
      await waitFor(() => expect(screen.queryByText(/proudspire manor/i)).not.toBeInTheDocument())

      // The form should not be cleared or disabled
      await waitFor(() => expect(input).not.toBeDisabled())
      await waitFor(() => expect(button).not.toBeDisabled())
      await waitFor(() => expect(input.value).toEqual(''))
    })
  })

  describe('when the response indicates the user is logged out', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            errors: ['Google OAuth token validation failed']
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies()

      // Find the shopping list create form
      const form = await screen.findByTestId('shopping-list-create-form')
      const input = await screen.findByLabelText('Title')

      fireEvent.change(input, { target: { value: 'Proudspire Manor' } })
      fireEvent.submit(form)


      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })
})
