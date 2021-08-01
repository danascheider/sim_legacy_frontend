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
import { renderWithRouter } from '../../../setupTests'
import { backendBaseUri } from '../../../utils/config'
import { AppProvider } from '../../../contexts/appContext'
import { GamesProvider } from '../../../contexts/gamesContext'
import { profileData, games, emptyGames } from '../../../sharedTestData'
import GamesPage from '../gamesPage'

describe('Deleting a game on the games page', () => {
  let component

  const renderComponentWithMockCookies = () => {
    const cookies = new Cookies('_sim_google_session="xxxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }}>
            <GamesPage />
          </GamesProvider>
        </AppProvider>
      </CookiesProvider>,
      { route: '/dashboard/games' }
    )
  }

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when successful', () => {
    const server = setupServer(
      rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
        return res(
          ctx.status(204)
        )
      })
    )

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
      component = renderComponentWithMockCookies()

      // Find the title of the game and get the container element
      const gameTitle = await screen.findByText(games[0].name)
      const gameEl = gameTitle.closest('.root')

      // Find the destroy icon next to the game's title
      const destroyIcon = await within(gameEl).findByTestId('game-destroy-icon')

      // Click the icon
      fireEvent.click(destroyIcon)

      // The user should be asked to confirm if they want to destroy the game
      expect(confirm).toHaveBeenCalled()
    })

    it('removes the game from the list, leaving other games alone', async () => {
      component = renderComponentWithMockCookies()

      // Find the title of the game and get the container element
      const gameTitle = await screen.findByText(games[0].name)
      const gameEl = gameTitle.closest('.root')

      // Find the destroy icon next to the game's title
      const destroyIcon = await within(gameEl).findByTestId('game-destroy-icon')

      // Click the icon
      fireEvent.click(destroyIcon)

      // The other game should still be visible
      await waitFor(() => expect(screen.queryByText(games[1].name)).toBeVisible())

      // The game should be removed from the view
      await waitFor(() => expect(gameEl).not.toBeInTheDocument())
    })
  })

  describe('cancelling deletion of a game', () => {
    let confirm

    beforeEach(() => {
      // For these tests, the user will click "Cancel" each time
      // they are asked.
      confirm = jest.spyOn(window, 'confirm').mockImplementation(() => false)
    })

    afterEach(() => confirm.mockRestore())

    it("shows a flash message and doesn't remove any games", async () => {
      component = renderComponentWithMockCookies()

      // Find the title of the game and get the container element
      const gameTitle = await screen.findByText(games[0].name)
      const gameEl = gameTitle.closest('.root')

      // Find the destroy icon next to the game's title
      const destroyIcon = await within(gameEl).findByTestId('game-destroy-icon')

      // Click the icon
      fireEvent.click(destroyIcon)

      // All the games should be visible
      await waitFor(() => expect(screen.queryByText(games[1].name)).toBeVisible())
      await waitFor(() => expect(gameEl).toBeVisible())

      // There should be a flash info message indicating the game was not deleted
      await waitFor(() => expect(screen.queryByText(/not deleted/)).toBeVisible())
    })
  })

  describe("when the game doesn't exist", () => {
    const server = setupServer(
      rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
        return res(
          ctx.status(404)
        )
      })
    )

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

    // A 404 error would only be returned if a user attempted to delete a game
    // after already having deleted it on another device or browser, so it makes
    // sense to not tell the user this detail and just remove the game if it
    // isn't found.
    it('behaves like successful deletion', async () => {
      component = renderComponentWithMockCookies()

      // Find the title of the game and get the container element
      const gameTitle = await screen.findByText(games[0].name)
      const gameEl = gameTitle.closest('.root')

      // Find the destroy icon next to the game's title
      const destroyIcon = await within(gameEl).findByTestId('game-destroy-icon')

      // Click the icon
      fireEvent.click(destroyIcon)

      // The game the user tried to delete should be removed but the other should
      // still be visible
      await waitFor(() => expect(screen.queryByText(games[1].name)).toBeVisible())
      await waitFor(() => expect(gameEl).not.toBeInTheDocument())
    })
  })

  describe('when there is an unexpected error', () => {
    const server = setupServer(
      rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ errors: ['Something went horribly wrong'] })
        )
      })
    )

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
      component = renderComponentWithMockCookies()

      // Find the title of the game and get the container element
      const gameTitle = await screen.findByText(games[0].name)
      const gameEl = gameTitle.closest('.root')

      // Find the destroy icon next to the game's title
      const destroyIcon = await within(gameEl).findByTestId('game-destroy-icon')

      // Click the icon
      fireEvent.click(destroyIcon)

      // The games should both be visible - neither should be removed
      await waitFor(() => expect(screen.queryByText(games[1].name)).toBeVisible())
      await waitFor(() => expect(gameEl).toBeVisible())

      // There should be a flash error message
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
    })
  })

  describe('when the server indicates the user has been logged out', () => {
    const server = setupServer(
      rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation failed'] })
        )
      })
    )

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

    it('redirects to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies()

      // Find the title of the game and get the container element
      const gameTitle = await screen.findByText(games[0].name)
      const gameEl = gameTitle.closest('.root')

      // Find the destroy icon next to the game's title
      const destroyIcon = await within(gameEl).findByTestId('game-destroy-icon')

      // Click the icon
      fireEvent.click(destroyIcon)

      // The user should be redirected to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })
})
