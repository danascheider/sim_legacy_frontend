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
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../setupTests'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../contexts/shoppingListsContext'
import {
  profileData,
  games,
  emptyGames,
  emptyShoppingLists
} from '../../sharedTestData'
import { allShoppingLists } from '../../sharedTestData'
import ShoppingListsPage from './shoppingListsPage'

describe('ShoppingListsPage', () => {
  let component

  const renderComponentWithMockCookies = (cookies, gameId = null) => {
    const route = gameId ? `/dashboard/shopping_lists?game_id=${gameId}` : '/dashboard/shopping_lists'

    let el
    act(() => {
      el = renderWithRouter(
        <CookiesProvider cookies={cookies}>
          <AppProvider overrideValue={{ profileData }}>
            <GamesProvider overrideValue={{ games }} >
              <ShoppingListsProvider>
                <ShoppingListsPage />
              </ShoppingListsProvider>
            </GamesProvider>
          </AppProvider>
        </CookiesProvider>,
        { route }
      )
      return undefined
    })

    return el
  }

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when the user is not signed in', () => {
    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    it('redirects to the login page', async () => {
      const { history } = component = await renderComponentWithMockCookies(cookies)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user token is expired or invalid', () => {
    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:id/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation failed'] })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = component = await renderComponentWithMockCookies(cookies)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user is signed in', () => {
    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    describe('when no query string is given', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/shopping_lists`, (req, res, ctx) => {
          const lists = allShoppingLists.filter(list => list.game_id === games[0].id)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('stays on the shopping lists page', async () => {
        const { history } = component = await renderComponentWithMockCookies(cookies)

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/shopping_lists'))
      })

      it('displays shopping lists for the first game', async () => {
        component = await renderComponentWithMockCookies(cookies)

        await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Lakeview Manor')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Heljarchen Hall')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Breezehome')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Windstad Manor')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText('Hjerim')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText(/no shopping lists/i)).not.toBeInTheDocument())
      })
    })

    describe('when a query string is given', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[1].id}/shopping_lists`, (req, res, ctx) => {
          const lists = allShoppingLists.filter(list => list.game_id === games[1].id)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('stays on the shopping lists page', async () => {
        const { history } = component = await renderComponentWithMockCookies(cookies, games[1].id)

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/shopping_lists'))
      })

      it('displays shopping lists for the specified game', async () => {
        component = await renderComponentWithMockCookies(cookies, games[1].id)

        await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Windstad Manor')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Hjerim')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Lakeview Manor')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText('Heljarchen Hall')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText('Breezehome')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText(/no shopping lists/i)).not.toBeInTheDocument())
      })
    })

    describe('when a game has no shopping lists', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/shopping_lists`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(emptyShoppingLists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('displays a message that the game has no shopping lists', async () => {
        component = renderComponentWithMockCookies(cookies, games[0].id)

        await waitFor(() => expect(screen.queryByText(/no shopping lists/i)).toBeVisible())
      })
    })
  })
})
