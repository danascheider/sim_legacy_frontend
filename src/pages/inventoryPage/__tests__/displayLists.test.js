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

describe('Displaying the inventory page', () => {
  let component

  const renderComponentWithMockCookies = (cookies, gameId = null, allGames = games) => {
    const route = gameId ? `dashboard/inventory?game_id=${gameeId}` : '/dashboard/inventory'

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games: allGames, gameLoadingState: 'done' }}>
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

  describe('when the user is not signed in', () => {
    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    it('redirects to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies(cookies)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user token is expired or invalid', () => {
    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:id/inventory_lists`, (req, res, ctx) => {
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
      const { history } = component = renderComponentWithMockCookies(cookies)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user is signed in', () => {
    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    describe('when no query string is given', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/inventory_lists`, (req, res, ctx) => {
          const lists = allInventoryLists.filter(list => list.game_id === games[0].id)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('stays on the inventory lists page', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies)

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/inventory'))
      })

      it('displays inventory lists for the first gamee', async () => {
        component = renderComponentWithMockCookies(cookies)

        // games[0]'s inventory lists should be visible on the page
        await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())
        expect(screen.queryByText('Lakeview Manor')).toBeVisible()
        expect(screen.queryByText('Heljarchen Hall')).toBeVisible()
        expect(screen.queryByText('Breezehome')).toBeVisible()

        // games[1]'s inventory lists should not be visible
        expect(screen.queryByText('Windstad Manor')).not.toBeInTheDocument()
        expect(screen.queryByText('Hjerim')).not.toBeInTheDocument()
        expect(screen.queryByText(/no shopping lists/i)).not.toBeInTheDocument()
      })
    })
  })
})
