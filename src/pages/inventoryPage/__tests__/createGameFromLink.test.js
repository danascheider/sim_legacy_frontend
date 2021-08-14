import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../setupTests'
import { backendBaseUri } from '../../../utils/config'
import { AppProvider } from '../../../contexts/appContext'
import { GamesProvider } from '../../../contexts/gamesContext'
import { InventoryListsProvider } from '../../../contexts/inventoryListsContext'
import {
  profileData,
  games,
  emptyGames,
  emptyInventoryLists,
  allInventoryLists
} from '../../../sharedTestData'
import InventoryPage from '../inventoryPage'

describe('Creating a new game from the link', () => {
  let component

  const renderComponentWithMockCookies = () => {
    const route = '/dashboard/inventory'
    const cookies = new Cookies('_sim_google_session=xxxxxx')
    cookies.HAS_DOCUMENT_COOKIE = false

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games: emptyGames, gameLoadingState: 'done' }} >
            <InventoryListsProvider>
              <InventoryPage />
            </InventoryListsProvider>
          </GamesProvider>
        </AppProvider>
      </CookiesProvider>,
      { route }
    )
  }

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when creation is successful', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allInventoryLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
        const name = req.body.game.name

        return res(
          ctx.status(201),
          ctx.json({
            id: 671,
            user_id: 24,
            description: null,
            name
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('creates a new game and displays its (empty) inventory lists', async () => {
      const { history } = component = renderComponentWithMockCookies()
      
      // Find and click the link you click to display the creation form
      const link = await screen.findByText(/create a game/i)
      fireEvent.click(link)

      // The modal with the form should now be visible
      const form = await screen.findByTestId('game-form')

      // Fill out and submit the form
      const nameInput = within(form).getByPlaceholderText('Name')
      const descInput = within(form).getByPlaceholderText('Description')

      fireEvent.change(nameInput, { target: { value: 'Distinctive Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })
      fireEvent.submit(form)

      // After successful creation, the modal with the form should be hidden
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // The input of the games dropdown component should be updated so the
      // active game is the newly created game
      const dropdownComponent = screen.getByTestId('games-dropdown')
      await waitFor(() => expect(within(dropdownComponent).queryByDisplayValue('Distinctive Name')).toBeVisible())

      // The message that the game has no inventory lists should be visible
      await waitFor(() => expect(screen.queryByText(/no inventory lists/i)).toBeVisible())

      // There should be a flash message that the game was created
      await waitFor(() => expect(screen.queryByText(/created/i)).toBeVisible())

      // The query string should be updated so the `game_id` param is set to the
      // ID of the newly created game
      await waitFor(() => expect(history.location.search).toEqual('?game_id=671'))
    })
  })

  describe('when there is a 422 error', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allInventoryLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
        const name = req.body.game.name

        return res(
          ctx.status(422),
          ctx.json({
            errors: ["Name can only contain alphanumeric characters, spaces, commas (,), hyphens (-), and apostrophes (')"]
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('displays the validation error', async () => {
      const { history } = component = renderComponentWithMockCookies()
      
      // Find and click the link you click to display the creation form
      const link = await screen.findByText(/create a game/i)
      fireEvent.click(link)

      // The modal with the form should now be visible
      const form = await screen.findByTestId('game-form')

      // Fill out and submit the form
      const nameInput = within(form).getByPlaceholderText('Name')
      const descInput = within(form).getByPlaceholderText('Description')

      fireEvent.change(nameInput, { target: { value: 'Distinctive Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })
      fireEvent.submit(form)

      // After successful creation, the modal with the form should be hidden
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // The input of the games dropdown component should not be updated since
      // there are still no games
      const dropdownComponent = screen.getByTestId('games-dropdown')
      await waitFor(() => expect(within(dropdownComponent).queryByPlaceholderText(/no games available/i)).toBeVisible())

      // The message that the user needs a game should be visible
      await waitFor(() => expect(screen.queryByText(/you need a game/i)).toBeVisible())

      // There should be a flash error message with the validation error
      await waitFor(() => expect(screen.queryByText(/name can only contain/i)).toBeVisible())

      // The query string should not be updated
      await waitFor(() => expect(history.location.search).toEqual(''))
    })
  })

  describe('when there is a 401 error', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allInventoryLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
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
      
      // Find and click the link you click to display the creation form
      const link = await screen.findByText(/create a game/i)
      fireEvent.click(link)

      // The modal with the form should now be visible
      const form = await screen.findByTestId('game-form')

      // Fill out and submit the form
      const nameInput = within(form).getByPlaceholderText('Name')
      const descInput = within(form).getByPlaceholderText('Description')

      fireEvent.change(nameInput, { target: { value: 'Distinctive Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })
      fireEvent.submit(form)

      // The user should be redirected to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when there is a 500 or other unexpected error', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allInventoryLists.filter(list => list.game_id === gameId)

        return res(
          ctx.status(200),
          ctx.json(lists)
        )
      }),
      rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
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

    it("doesn't change games and displays an error message", async () => {
      const { history } = component = renderComponentWithMockCookies()
      
      // Find and click the link you click to display the creation form
      const link = await screen.findByText(/create a game/i)
      fireEvent.click(link)

      // The modal with the form should now be visible
      const form = await screen.findByTestId('game-form')

      // Fill out and submit the form
      const nameInput = within(form).getByPlaceholderText('Name')
      const descInput = within(form).getByPlaceholderText('Description')

      fireEvent.change(nameInput, { target: { value: 'Distinctive Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })
      fireEvent.submit(form)

      // The modal with the form should be hidden after the 500 response
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // The input of the games dropdown component should still be empty
      // since no game was created
      const dropdownComponent = screen.getByTestId('games-dropdown')
      await waitFor(() => expect(within(dropdownComponent).queryByPlaceholderText(/no games available/i)).toBeVisible())

      // The message that the user needs a game to use the inventory lists
      // feature should be visible
      await waitFor(() => expect(screen.queryByText(/you need a game/i)).toBeVisible())

      // There should be a flash error message
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())

      // The query string should not be updated since there are still no games
      await waitFor(() => expect(history.location.search).toEqual(''))
    })
  })
})
