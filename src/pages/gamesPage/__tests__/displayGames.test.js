import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  waitFor,
  screen,
  fireEvent
} from '@testing-library/react'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../setupTests'
import { backendBaseUri } from '../../../utils/config'
import { AppProvider } from '../../../contexts/appContext'
import { GamesProvider } from '../../../contexts/gamesContext'
import { profileData, games, emptyGames } from '../../../sharedTestData'
import GamesPage from '../gamesPage'

describe('Displaying the games page', () => {
  let component

  const renderComponentWithMockCookies = (value = '_sim_google_session="xxxxxxx"') => {
    const cookies = new Cookies(value)
    cookies.HAS_DOCUMENT_COOKIE = false

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider>
            <GamesPage />
          </GamesProvider>
        </AppProvider>
      </CookiesProvider>,
      { route: '/dashboard/games' }
    )
  }

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when the user is not signed in', () => {
    it('redirects to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies(null)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user token is expired or invalid', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
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
      const { history } = component = renderComponentWithMockCookies()

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user is signed in', () => {
    describe('when the games are fetched successfully', () => {
      describe('when there are no games', () => {
        const server = setupServer(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(emptyGames)
            )
          })
        )

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('stays on the games page', async () => {
          const { history } = component = renderComponentWithMockCookies()

          await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
        })

        it('displays the games page', async () => {
          component = renderComponentWithMockCookies()

          const el = await screen.findByText(/your games/i)

          expect(el).toBeInTheDocument()
        })

        it('displays a message that there are no games', async () => {
          component = renderComponentWithMockCookies()

          const el = await screen.findByText(/no games/i)

          expect(el).toBeInTheDocument()
        })

        it("doesn't display an error message", async () => {
          component = renderComponentWithMockCookies()

          await waitFor(() => expect(screen.queryByText(/error/i)).not.toBeInTheDocument())
        })
      })

      describe('when there are games', () => {
        const server = setupServer(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          })
        )

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('stays on the games page', async () => {
          const { history } = component = renderComponentWithMockCookies()

          await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
        })

        it('displays the games page', async () => {
          component = renderComponentWithMockCookies()

          await waitFor(() => expect(screen.queryByText(/your games/i)).toBeVisible())
        })

        it('displays the list of games', async () => {
          component = renderComponentWithMockCookies()

          await waitFor(() => expect(screen.queryByText(games[0].name)).toBeVisible())
          expect(screen.queryByText(games[1].name)).toBeVisible()
        })

        it("doesn't display the 'You have no games' message", async () => {
          component = renderComponentWithMockCookies()

          await waitFor(() => expect(screen.queryByText(/no games/i)).not.toBeInTheDocument())
        })

        it("doesn't display an error message", async () => {
          component = renderComponentWithMockCookies()

          await waitFor(() => expect(screen.queryByText(/error/i)).not.toBeInTheDocument())
        })

        it("doesn't display the descriptions to start with", async () => {
          component = renderComponentWithMockCookies()

          await waitFor(() => expect(screen.queryByText(games[0].description)).not.toBeVisible())
          expect(screen.queryByText(games[1].description)).not.toBeVisible()
          expect(screen.queryByText('This game has no description.')).not.toBeVisible()
        })

        it('expands one description at a time', async () => {
          component = renderComponentWithMockCookies()

          // Clicking the game's title expands its description
          const titleEl = await screen.findByText(games[0].name)
          fireEvent.click(titleEl)

          await waitFor(() => expect(screen.queryByText(games[0].description)).toBeVisible())
          expect(screen.queryByText(games[1].description)).not.toBeVisible()
          expect(screen.queryByText('This game has no description.')).not.toBeVisible()
        })
      })
    })

    describe('when there is an error fetching the games', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ errors: ['Something went horribly wrong'] })
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('stays on the games page', async () => {
        const { history } = component = renderComponentWithMockCookies()

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
      })

      it("doesn't display the 'You have no games' message", async () => {
        component = renderComponentWithMockCookies()

        await waitFor(() => expect(screen.queryByText(/no games/i)).not.toBeInTheDocument())
      })

      it('displays an error message', async () => {
        component = renderComponentWithMockCookies()

        await waitFor(() => expect(screen.queryByText(/error/i)).toBeInTheDocument())
      })
    })
  })
})
