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
import userEvent from '@testing-library/user-event'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../setupTests'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { profileData, games, emptyGames } from './testData'
import GamesPage from './gamesPage'

describe('GamesPage', () => {
  let component

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when the user is not signed in', () => {
    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    it('redirects to the login page', async () => {
      act(() => {
        component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
        return undefined
      })
      const { history } = component

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user token is expired or invalid', () => {
    const server = setupServer(
      rest.get(`${backendBaseUri}/users/current`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation failed'] })
        )
      }),
      rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation failed'] })
        )
      })
    )

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      act(() => {
        component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
        return undefined
      })
      const { history } = component

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user is signed in', () => {
    const cookies = new Cookies('_sim_google_session="xxxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    describe('when the games are fetched successfully', () => {
      describe('when there are no games', () => {
        const server = setupServer(
          rest.get(`${backendBaseUri}/users/current`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(profileData)
            )
          }),
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
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })
          const { history } = component

          await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
        })

        it('displays the games page', async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          const el = await screen.findByText(/your games/i)

          expect(el).toBeInTheDocument()
        })

        it('displays a message that there are no games', async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          const el = await screen.findByText(/no games/i)

          expect(el).toBeInTheDocument()
        })

        it("doesn't display an error message", async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          await waitFor(() => expect(screen.queryByText(/error/i)).not.toBeInTheDocument())
        })
      })

      describe('when there are games', () => {
        const server = setupServer(
          rest.get(`${backendBaseUri}/users/current`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(profileData)
            )
          }),
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
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })
          const { history } = component

          await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
        })

        it('displays the games page', async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          const el = await screen.findByText(/your games/i)

          expect(el).toBeInTheDocument()
        })

        it('displays the list of games', async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          const el1 = await screen.findByText(games[0].name)
          const el2 = await screen.findByText(games[1].name)

          expect(el1).toBeInTheDocument()
          expect(el2).toBeInTheDocument()
        })

        it("doesn't display the 'You have no games' message", async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          await waitFor(() => expect(screen.queryByText(/no games/i)).not.toBeInTheDocument())
        })

        it("doesn't display an error message", async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          await waitFor(() => expect(screen.queryByText(/error/i)).not.toBeInTheDocument())
        })

        it("doesn't display the descriptions to start with", async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          await waitFor(() => expect(screen.queryByText(games[0].description)).not.toBeVisible())
          await waitFor(() => expect(screen.queryByText('This game has no description.')).not.toBeVisible())
        })

        it('expands one description at a time', async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          const titleEl = await screen.findByText(games[0].name)

          fireEvent.click(titleEl)

          await waitFor(() => expect(screen.queryByText(games[0].description)).toBeVisible())
          await waitFor(() => expect(screen.queryByText('This game has no description.')).not.toBeVisible())
        })
      })

      describe('creating a game successfully', () => {
        const server = setupServer(
          rest.get(`${backendBaseUri}/users/current`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(profileData)
            )
          }),
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
            const returnData = { id: 27, user_id: profileData.id, name: 'Another Game', description: 'New game description' }

            return res(
              ctx.status(201),
              ctx.json(returnData)
            )
          })
        )

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('adds the game to the list', async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          const nameInput = await screen.findByLabelText('Name')
          const descInput = await screen.findByLabelText('Description')
          const form = await screen.findByTestId('game-create-form')

          fireEvent.change(nameInput, { target: { value: 'Another Game' } })
          fireEvent.change(descInput, { target: { value: 'New game description' } })

          act(() => {
            fireEvent.submit(form)
            return undefined
          })

          const newGame = await screen.findByText('Another Game')

          expect(newGame).toBeVisible()
        })
      })

      describe('creating a game with invalid attributes', () => {
        const server = setupServer(
          rest.get(`${backendBaseUri}/users/current`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(profileData)
            )
          }),
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
            const returnData = { errors: ['Name must be unique'] }

            return res(
              ctx.status(422),
              ctx.json(returnData)
            )
          })
        )

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('displays the error message', async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          const nameInput = await screen.findByLabelText('Name')
          const descInput = await screen.findByLabelText('Description')
          const form = await screen.findByTestId('game-create-form')

          fireEvent.change(nameInput, { target: { value: 'Another Game' } })
          fireEvent.change(descInput, { target: { value: 'New game description' } })

          act(() => {
            fireEvent.submit(form)
            return undefined
          })

          const newGameEl = await screen.queryByText('Another Game')
          const errorEl = await screen.findByText(/Name must be unique/)

          expect(newGameEl).not.toBeInTheDocument()
          expect(errorEl).toBeVisible()
        })
      })

      describe('creating a game when something unexpected goes wrong', () => {
        const server = setupServer(
          rest.get(`${backendBaseUri}/users/current`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(profileData)
            )
          }),
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
            const returnData = { errors: ['Something went horribly wrong'] }

            return res(
              ctx.status(500),
              ctx.json(returnData)
            )
          })
        )

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('displays a generic error message', async () => {
          act(() => {
            component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
            return undefined
          })

          const nameInput = await screen.findByLabelText('Name')
          const descInput = await screen.findByLabelText('Description')
          const form = await screen.findByTestId('game-create-form')

          fireEvent.change(nameInput, { target: { value: 'Another Game' } })
          fireEvent.change(descInput, { target: { value: 'New game description' } })

          act(() => {
            fireEvent.submit(form)
            return undefined
          })

          const newGameEl = await screen.queryByText('Another Game')
          const errorEl = await screen.findByText(/unexpected error/i)

          expect(newGameEl).not.toBeInTheDocument()
          expect(errorEl).toBeVisible()
        })
      })

    })

    describe('when there is an error fetching the games', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/users/current`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(profileData)
          )
        }),
        rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ errors: ['Something went horribly wrong'] })
          )
        })
      )

      // It was giving me errors about this not being defined and I'm
      // thinking of removing this from the flash display function anyway
      // so I decided to just turn it into a noop here
      const originalScrollTo = window.scrollTo

      beforeAll(() => {
        server.listen()
        window.scrollTo = () => {}
      })

      beforeEach(() => server.resetHandlers())
      afterAll(() => {
        server.close()
        window.scrollTo = originalScrollTo
      })

      it('stays on the games page', async () => {
        act(() => {
          component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
          return undefined
        })
        const { history } = component

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
      })

      it("doesn't display the 'You have no games' message", async () => {
        act(() => {
          component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
          return undefined
        })

        await waitFor(() => expect(screen.queryByText(/no games/i)).not.toBeInTheDocument())
      })

      it('displays an error message', async () => {
        act(() => {
          component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
          return undefined
        })

        const el = await screen.findByText(/error/i)

        expect(el).toBeInTheDocument()
      })
    })
  })
})
