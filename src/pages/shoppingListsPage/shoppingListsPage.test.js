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
import { profileData, games, emptyGames } from '../../sharedTestData'
import { game1Lists, game2Lists, game3Lists } from '../../sharedTestData'
import ShoppingListsPage from './shoppingListsPage'

describe('ShoppingListsPage', () => {
  let component

  const renderComponentWithMockCookies = (cookies, gameId = null) => {
    const route = gameId ? `/dashboards/shopping_lists?game_id=${gameId}` : '/dashboard/shopping_lists'

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
      const { history } = component = renderComponentWithMockCookies(cookies)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user token is expired or invalid', () => {
    const server = setupServer(
      rest.get('games/:id/shopping_lists', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation failed'] })
        )
      })
    )

    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies(cookies)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })

  })
})
