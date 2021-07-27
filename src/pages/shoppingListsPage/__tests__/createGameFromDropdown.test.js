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
import { ShoppingListsProvider } from '../../../contexts/shoppingListsContext'
import {
  profileData,
  games,
  emptyGames,
  emptyShoppingLists,
  allShoppingLists
} from '../../../sharedTestData'
import ShoppingListsPage from '../shoppingListsPage'

describe('creating a new game from the dropdown', () => {
  let component

  const renderComponentWithMockCookies = () => {
    const route = `/dashboard/shopping_lists?game_id=${games[0].id}`
    const cookies = new Cookies('_sim_google_session=xxxxxx')
    cookies.HAS_DOCUMENT_COOKIE = false

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games: games, gameLoadingState: 'done' }} >
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

  describe('happy path', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

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

    it('creates a new game and displays its (empty) shopping lists', async () => {
      const { history } = component = renderComponentWithMockCookies()
      
      const dropdownComponent = await screen.findByTestId('games-dropdown')
      const dropdownInput = dropdownComponent.getElementsByTagName('input')[0]

      fireEvent.change(dropdownInput, { target: { value: 'Distinctive Name' } })
      fireEvent.keyDown(dropdownInput, { key: 'Enter', code: 'Enter' })

      await waitFor(() => expect(within(dropdownComponent).queryByDisplayValue('Distinctive Name')).toBeVisible())
      await waitFor(() => expect(history.location.search).toEqual('?game_id=671'))
      await waitFor(() => expect(screen.queryByText(/no shopping lists/i)).toBeVisible())
    })
  })

  describe('when there is a 422 error', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

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
      
      const dropdownComponent = await screen.findByTestId('games-dropdown')
      const dropdownInput = dropdownComponent.getElementsByTagName('input')[0]

      fireEvent.change(dropdownInput, { target: { value: 'Distinctive Name' } })
      fireEvent.keyDown(dropdownInput, { key: 'Enter', code: 'Enter' })

      // The game should not appear in the dropdown
      await waitFor(() => expect(within(dropdownComponent).queryByText('Distinctive Name')).not.toBeInTheDocument())

      // The dropdown should be hidden (jsdom doesn't pick up on CSS, so we have to
      // verify that it has the class and just trust the CSS to define that it isn't
      // visible)
      await waitFor(() => expect(within(dropdownComponent).queryByRole('listbox')).toHaveClass('hidden'))

      // The query string should be set to the first actual game
      await waitFor(() => expect(history.location.search).toEqual(`?game_id=${games[0].id}`))

      // The flash message should be displayed
      await waitFor(() => expect(screen.queryByText(/can only contain/i)).toBeVisible())
    })
  })

  describe('when there is a 401 error', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

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
      
      const dropdownComponent = await screen.findByTestId('games-dropdown')
      const dropdownInput = dropdownComponent.getElementsByTagName('input')[0]

      fireEvent.change(dropdownInput, { target: { value: 'Distinctive Name' } })
      fireEvent.keyDown(dropdownInput, { key: 'Enter', code: 'Enter' })

      // The user should be redirected to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when there is a 500 or other unexpected error', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
        const gameId = parseInt(req.params.gameId)
        const lists = allShoppingLists.filter(list => list.game_id === gameId)

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
      
      const dropdownComponent = await screen.findByTestId('games-dropdown')
      const dropdownInput = dropdownComponent.getElementsByTagName('input')[0]

      fireEvent.change(dropdownInput, { target: { value: 'Distinctive Name' } })
      fireEvent.keyDown(dropdownInput, { key: 'Enter', code: 'Enter' })

      // The game should not appear in the dropdown
      await waitFor(() => expect(within(dropdownComponent).queryByText('Distinctive Name')).not.toBeInTheDocument())

      // The dropdown should be hidden (jsdom doesn't pick up on CSS, so we have to
      // verify that it has the class and just trust the CSS to define that it isn't
      // visible)
      await waitFor(() => expect(within(dropdownComponent).queryByRole('listbox')).toHaveClass('hidden'))

      // The query string should be set to the first actual game
      await waitFor(() => expect(history.location.search).toEqual(`?game_id=${games[0].id}`))

      // The flash message should be displayed
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
    })
  })
})
