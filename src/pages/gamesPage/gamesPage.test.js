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
import { within } from '@testing-library/dom'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../setupTests'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { profileData, games, emptyGames } from '../../sharedTestData'
import GamesPage from './gamesPage'

describe('GamesPage', () => {
  let component

  const renderComponentWithMockCookies = cookies => {
    let el
    act(() => {
      el = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><GamesProvider><GamesPage /></GamesProvider></AppProvider></CookiesProvider>, { route: '/dashboard/games' })
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
      const { history } = component = renderComponentWithMockCookies(cookies)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user is signed in', () => {
    const cookies = new Cookies('_sim_google_session="xxxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    const sharedHandlers = [
      rest.get(`${backendBaseUri}/users/current`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(profileData)
        )
      })
    ]

    describe('when the games are fetched successfully', () => {
      describe('when there are no games', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(emptyGames)
            )
          })
        )

        const server = setupServer.apply(null, handlers)

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('stays on the games page', async () => {
          const { history } = component = renderComponentWithMockCookies(cookies)

          await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
        })

        it('displays the games page', async () => {
          component = renderComponentWithMockCookies(cookies)

          const el = await screen.findByText(/your games/i)

          expect(el).toBeInTheDocument()
        })

        it('displays a message that there are no games', async () => {
          component = renderComponentWithMockCookies(cookies)

          const el = await screen.findByText(/no games/i)

          expect(el).toBeInTheDocument()
        })

        it("doesn't display an error message", async () => {
          component = renderComponentWithMockCookies(cookies)

          await waitFor(() => expect(screen.queryByText(/error/i)).not.toBeInTheDocument())
        })
      })

      describe('when there are games', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          })
        )

        const server = setupServer.apply(null, handlers)

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('stays on the games page', async () => {
          const { history } = component = renderComponentWithMockCookies(cookies)

          await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
        })

        it('displays the games page', async () => {
          component = renderComponentWithMockCookies(cookies)

          const el = await screen.findByText(/your games/i)

          expect(el).toBeInTheDocument()
        })

        it('displays the list of games', async () => {
          component = renderComponentWithMockCookies(cookies)

          const el1 = await screen.findByText(games[0].name)
          const el2 = await screen.findByText(games[1].name)

          expect(el1).toBeInTheDocument()
          expect(el2).toBeInTheDocument()
        })

        it("doesn't display the 'You have no games' message", async () => {
          component = renderComponentWithMockCookies(cookies)

          await waitFor(() => expect(screen.queryByText(/no games/i)).not.toBeInTheDocument())
        })

        it("doesn't display an error message", async () => {
          component = renderComponentWithMockCookies(cookies)

          await waitFor(() => expect(screen.queryByText(/error/i)).not.toBeInTheDocument())
        })

        it("doesn't display the descriptions to start with", async () => {
          component = renderComponentWithMockCookies(cookies)

          await waitFor(() => expect(screen.queryByText(games[0].description)).not.toBeVisible())
          await waitFor(() => expect(screen.queryByText(games[1].description)).not.toBeVisible())
          await waitFor(() => expect(screen.queryByText('This game has no description.')).not.toBeVisible())
        })

        it('expands one description at a time', async () => {
          component = renderComponentWithMockCookies(cookies)

          const titleEl = await screen.findByText(games[0].name)

          fireEvent.click(titleEl)

          await waitFor(() => expect(screen.queryByText(games[0].description)).toBeVisible())
          await waitFor(() => expect(screen.queryByText('This game has no description.')).not.toBeVisible())
        })
      })

      describe('creating a game successfully', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
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

        const server = setupServer.apply(null, handlers)

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('adds the game to the list and hides the form', async () => {
          component = renderComponentWithMockCookies(cookies)

          const toggleLink = await screen.findByText('Create Game...')

          fireEvent.click(toggleLink)

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
          await waitFor(() => expect(form).not.toBeVisible())
        })
      })

      describe('creating a game with invalid attributes', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
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

        const server = setupServer.apply(null, handlers)

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('displays the error message and leaves the form as-is', async () => {
          component = renderComponentWithMockCookies(cookies)

          const toggleLink = await screen.findByText('Create Game...')

          fireEvent.click(toggleLink)

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
          await waitFor(() => expect(form).toBeVisible())
        })
      })

      describe('creating a game when something unexpected goes wrong', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
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

        const server = setupServer.apply(null, handlers)

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('displays a generic error message and hides the form', async () => {
          component = renderComponentWithMockCookies(cookies)

          const toggleLink = await screen.findByText('Create Game...')

          fireEvent.click(toggleLink)

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
          const errorEl = await screen.findByText(/something unexpected happened/i)

          expect(newGameEl).not.toBeInTheDocument()
          expect(errorEl).toBeVisible()
          await waitFor(() => expect(form).not.toBeVisible())
        })
      })

      describe('editing a game successfully', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
            const gameId = parseInt(req.params.id)
            const name = req.body.game.name
            const description = req.body.game.description

            const body = { id: gameId, user_id: profileData.id, name, description }

            return res(
              ctx.status(200),
              ctx.json(body)
            )
          })
        )

        const server = setupServer.apply(null, handlers)
        const { name, description, id } = games[0]

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it('updates, hides the form, and displays a success message', async () => {
          component = renderComponentWithMockCookies(cookies)

          const editIcon = await screen.findByTestId(`edit-icon-game-id-${id}`)

          // Display the edit form
          act(() => {
            fireEvent.click(editIcon)
            return undefined;
          })

          const form = await screen.findByTestId('game-edit-form')
          const nameInput = await within(form).findByLabelText('Name')
          const descInput = await within(form).findByLabelText('Description')

          fireEvent.change(nameInput, { target: { value: 'Changed Name' } })
          fireEvent.change(descInput, { target: { value: 'New description' } })

          // Submit the edit form
          act(() => {
            fireEvent.submit(form)
            return undefined;
          })

          await waitForElementToBeRemoved(form)
          const flashMessage = await screen.findByText(/success/i)

          // Form should be hidden on a successful response
          expect(form).not.toBeInTheDocument()

          // Flash message should be displayed
          expect(flashMessage).toBeVisible()

          // The game should no longer appear in the list under its old name
          await waitFor(() => expect(screen.queryByText(games[0].name)).not.toBeInTheDocument())

          // It should be in the list under its new name
          await waitFor(() => expect(screen.queryByText(/Changed Name/)).toBeVisible())
        })
      })

      describe("editing a game that doesn't exist", () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
            return res(
              ctx.status(404)
            )
          })
        )

        const server = setupServer.apply(null, handlers)
        const { name, description, id } = games[0]

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        // I'd rather not have so many expectations in one test but, you know,
        // behaviour-based testing
        it("displays a flash error and doesn't update the name", async () => {
          component = renderComponentWithMockCookies(cookies)

          const editIcon = await screen.findByTestId(`edit-icon-game-id-${id}`)

          // Display the edit form
          act(() => {
            fireEvent.click(editIcon)
            return undefined;
          })

          const form = await screen.findByTestId('game-edit-form')
          const nameInput = await within(form).findByLabelText('Name')
          const descInput = await within(form).findByLabelText('Description')

          fireEvent.change(nameInput, { target: { value: 'Changed Name' } })
          fireEvent.change(descInput, { target: { value: 'New description' } })

          // Submit the edit form
          act(() => {
            fireEvent.submit(form)
            return undefined;
          })

          await waitForElementToBeRemoved(form)
          const flashMessage = await screen.findByText(/could not be found/i)

          // Form should be hidden
          expect(form).not.toBeInTheDocument()

          // Flash message should be displayed
          expect(flashMessage).toBeVisible()

          // The game should no longer appear in the list under its old name
          await waitFor(() => expect(screen.queryByText('Changed Name')).not.toBeInTheDocument())

          // It should be in the list under its new name
          await waitFor(() => expect(screen.queryByText(games[0].name)).toBeVisible())
        })
      })

      describe('editing a game with invalid attributes', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
            return res(
              ctx.status(422),
              ctx.json({
                errors: ['Name must be unique']
              })
            )
          })
        )

        const server = setupServer.apply(null, handlers)
        const { name, description, id } = games[0]

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it("shows an error and doesn't hide the form or update the game", async () => {
          component = renderComponentWithMockCookies(cookies)

          const editIcon = await screen.findByTestId(`edit-icon-game-id-${id}`)

          // Display the edit form
          act(() => {
            fireEvent.click(editIcon)
            return undefined;
          })

          const form = await screen.findByTestId('game-edit-form')
          const nameInput = await within(form).findByLabelText('Name')
          const descInput = await within(form).findByLabelText('Description')

          // Fill this out with an actual duplicate name even though the API
          // call is mocked, for maximum realism
          fireEvent.change(nameInput, { target: { value: games[1].name } })
          fireEvent.change(descInput, { target: { value: 'New description' } })

          // Submit the edit form
          act(() => {
            fireEvent.submit(form)
            return undefined;
          })

          const flashError = await screen.findByText(/name must be unique/i)
          const gameWithOldName = await screen.findByText(games[0].name)
          const gamesWithNewName = await screen.queryAllByText(games[1].name)

          expect(flashError).toBeVisible()
          expect(form).not.toBeVisible()
          expect(gameWithOldName).toBeVisible()
          expect(gamesWithNewName.length).toEqual(1)
        })
      })

      describe('handling a 500 error while editing a game', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({
                errors: ['Something went horribly wrong']
              })
            )
          })
        )

        const server = setupServer.apply(null, handlers)
        const { name, description, id } = games[0]

        beforeAll(() => server.listen())
        beforeEach(() => server.resetHandlers())
        afterAll(() => server.close())

        it("shows an error and hides the form", async () => {
          component = renderComponentWithMockCookies(cookies)

          const editIcon = await screen.findByTestId(`edit-icon-game-id-${id}`)

          // Display the edit form
          act(() => {
            fireEvent.click(editIcon)
            return undefined;
          })

          const form = await screen.findByTestId('game-edit-form')
          const nameInput = await within(form).findByLabelText('Name')
          const descInput = await within(form).findByLabelText('Description')

          // Fill this out with an actual duplicate name even though the API
          // call is mocked, for maximum realism
          fireEvent.change(nameInput, { target: { value: 'Changed Name' } })
          fireEvent.change(descInput, { target: { value: 'New description' } })

          // Submit the edit form
          act(() => {
            fireEvent.submit(form)
            return undefined;
          })

          const flashError = await screen.findByText(/unexpected error/i)
          const gameWithOldName = await screen.findByText(games[0].name)
          const gameWithNewName = await screen.queryByText('Changed Name')

          await waitFor(() => expect(form).not.toBeVisible())
          expect(flashError).toBeVisible()
          expect(gameWithOldName).toBeVisible()
          expect(gameWithNewName).not.toBeInTheDocument()
        })
      })

      describe('successfully deleting a game', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
            return res(
              ctx.status(204)
            )
          })
        )

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

        it('confirms before deleting', async () => {
          component = renderComponentWithMockCookies(cookies)

          const destroyIcon = await screen.findByTestId(`destroy-icon-game-id-${games[0].id  }`)

          // Click the icon
          act(() => {
            fireEvent.click(destroyIcon)
            return undefined;
          })

          expect(confirm).toHaveBeenCalled()
        })

        it('removes the game from the list, leaving other games alone', async () => {
          component = renderComponentWithMockCookies(cookies)

          const game = await screen.findByText(games[0].name)
          const destroyIcon = await screen.findByTestId(`destroy-icon-game-id-${games[0].id  }`)

          // Click the icon
          act(() => {
            fireEvent.click(destroyIcon)
            return undefined;
          })

          await waitFor(() => expect(screen.queryByText(games[1].name)).toBeVisible())
          await waitForElementToBeRemoved(game)
          expect(game).not.toBeInTheDocument()
        })
      })

      describe('cancelling deletion of a game', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          })
        )

        const server = setupServer.apply(null, handlers)
        let confirm

        beforeAll(() => server.listen())

        beforeEach(() => {
          server.resetHandlers()

          // For these tests, the user will click "Cancel" each time
          // they are asked.
          confirm = jest.spyOn(window, 'confirm').mockImplementation(() => false)
        })

        afterEach(() => confirm.mockRestore())

        afterAll(() => server.close())

        it('confirms before deleting', async () => {
          component = renderComponentWithMockCookies(cookies)

          const destroyIcon = await screen.findByTestId(`destroy-icon-game-id-${games[0].id  }`)

          // Click the icon
          act(() => {
            fireEvent.click(destroyIcon)
            return undefined;
          })

          expect(confirm).toHaveBeenCalled()
        })

        it("shows a flash message and doesn't remove any games", async () => {
          component = renderComponentWithMockCookies(cookies)

          const game = await screen.findByText(games[0].name)
          const destroyIcon = await screen.findByTestId(`destroy-icon-game-id-${games[0].id  }`)

          // Click the icon
          act(() => {
            fireEvent.click(destroyIcon)
            return undefined;
          })

          await waitFor(() => expect(screen.queryByText(games[1].name)).toBeVisible())
          await waitFor(() => expect(game).toBeVisible())
          await waitFor(() => expect(screen.queryByText(/not deleted/)).toBeVisible())
        })
      })

      describe("deleting a game that doesn't exist", () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
            return res(
              ctx.status(404)
            )
          })
        )

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

        it('behaves like successful deletion', async () => {
          component = renderComponentWithMockCookies(cookies)

          const game = await screen.findByText(games[0].name)
          const destroyIcon = await screen.findByTestId(`destroy-icon-game-id-${games[0].id  }`)

          // Display the edit form
          act(() => {
            fireEvent.click(destroyIcon)
            return undefined;
          })

          await waitFor(() => expect(screen.queryByText(games[1].name)).toBeVisible())
          await waitFor(() => expect(game).not.toBeInTheDocument())
        })
      })

     describe('handling a 500 error while deleting a game', () => {
        const handlers = [...sharedHandlers]
        handlers.push(
          rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json(games)
            )
          }),
          rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({ errors: ['Something went horribly wrong'] })
            )
          })
        )

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

        it("shows an error message and doesn't remove the game", async () => {
          component = renderComponentWithMockCookies(cookies)

          const game = await screen.findByText(games[0].name)
          const destroyIcon = await screen.findByTestId(`destroy-icon-game-id-${games[0].id  }`)

          // Click the icon
          act(() => {
            fireEvent.click(destroyIcon)
            return undefined;
          })

          await waitFor(() => expect(screen.queryByText(games[1].name)).toBeVisible())
          await waitFor(() => expect(game).toBeVisible())
          await waitFor(() => expect(screen.queryByText(/unexpected error/)).toBeVisible())
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

      it("doesn't display the 'You have no games' message", async () => {
        component = renderComponentWithMockCookies(cookies)

        await waitFor(() => expect(screen.queryByText(/no games/i)).not.toBeInTheDocument())
      })

      it('displays an error message', async () => {
        component = renderComponentWithMockCookies(cookies)

        const el = await screen.findByText(/error/i)

        expect(el).toBeInTheDocument()
      })
    })
  })
})
