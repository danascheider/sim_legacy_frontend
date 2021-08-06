import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  waitFor,
  screen,
  fireEvent,
  waitForElementToBeRemoved
} from '@testing-library/react'
import { within } from '@testing-library/dom'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../setupTests'
import { backendBaseUri } from '../../../utils/config'
import { AppProvider } from '../../../contexts/appContext'
import { GamesProvider } from '../../../contexts/gamesContext'
import { profileData, games } from '../../../sharedTestData'
import GamesPage from '../gamesPage'

describe('Editing a game on the games page', () => {
  let component

  const renderComponentWithMockCookies = () => {
    const cookies = new Cookies('_sim_google_session=xxxxxxx')
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

  describe('cancelling update with the escape key', () => {
    const { name } = games[0]

    it('hides the form', async () => {
      component = renderComponentWithMockCookies()

      const gameTitle = await screen.findByText(name)
      const gameEl = gameTitle.closest('.root')

      // The icon you click to display the form
      const editIcon = within(gameEl).getByTestId('game-edit-icon')

      // Display the edit form
      fireEvent.click(editIcon)

      // The modal and form element should be visible now
      const modal = await screen.findByRole('dialog')
      const form = within(modal).getByTestId('game-form')
      expect(form).toBeVisible()

      // Press the escape key to hide the modal and form
      fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' })

      // Modal and form should be hidden
      await waitFor(() => expect(modal).not.toBeVisible())
    })
  })

  describe('cancelling update with click outside the form', () => {
    const { name } = games[0]

    it('hides the form', async () => {
      component = renderComponentWithMockCookies()

      const gameTitle = await screen.findByText(name)
      const gameEl = gameTitle.closest('.root')

      // The icon you click to display the form
      const editIcon = within(gameEl).getByTestId('game-edit-icon')

      // Display the edit form
      fireEvent.click(editIcon)

      // The modal and form element should be visible now
      const modal = await screen.findByRole('dialog')
      const form = within(modal).getByTestId('game-form')
      expect(form).toBeVisible()

      // Click on the modal (outside the form)
      fireEvent.click(modal)

      // Modal and form should be hidden
      await waitFor(() => expect(modal).not.toBeVisible())
    })
  })

  describe('successful update', () => {
    const server = setupServer(
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

    const { name, description } = games[0]

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    
    it('updates, hides the form, and displays a success message', async () => {
      component = renderComponentWithMockCookies()

      const gameTitle = await screen.findByText(name)
      const gameEl = gameTitle.closest('.root')

      // The icon you click to display the form
      const editIcon = within(gameEl).getByTestId('game-edit-icon')

      // Display the edit form
      fireEvent.click(editIcon)

      const form = await screen.findByTestId('game-form')
      const nameInput = within(form).getByDisplayValue(name)
      const descInput = within(form).getByDisplayValue(description)

      // Fill out the inputs
      fireEvent.change(nameInput, { target: { value: 'Changed Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })

      // Submit the edit form
      fireEvent.submit(form)

      // Form should be hidden on a successful response
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // The game' should no longer appear in the list under its old name
      await waitFor(() => expect(screen.queryByText(name)).not.toBeInTheDocument())

      // It should be in the list under its new name
      await waitFor(() => expect(screen.queryByText(/Changed Name/)).toBeVisible())

      // Flash message should be displayed
      await waitFor(() => expect(screen.queryByText(/success/i)).toBeVisible())
    })
  })

  // I'm commenting out these tests because they will never pass due to yet
  // another bug in JSDOM. The functionality needs to be tested but I'm not
  // sure what else to try and nobody has apparently been able to find a
  // workaround for the bug. https://github.com/jsdom/jsdom/issues/2898

  // I'm leaving the dead code here because I don't want the tests to be
  // forgotten about.

  // describe('form validations', () => {
  //   const { name, description } = games[0]

  //   it("doesn't submit with an invalid name", async () => {
  //     component = renderComponentWithMockCookies()

  //     const gameTitle = await screen.findByText(name)
  //     const gameEl = gameTitle.closest('.root')

  //     // The icon you click to display the form
  //     const editIcon = await within(gameEl).findByTestId('game-edit-icon')

  //     // Display the edit form
  //     fireEvent.click(editIcon)

  //     const form = await screen.findByTestId('game-form')
  //     const nameInput = await within(form).findByDisplayValue(name)
  //     const descInput = await within(form).findByDisplayValue(description)

  //     // Fill out the inputs
  //     fireEvent.change(nameInput, { target: { value: '@$75*&@$' } })
  //     fireEvent.change(descInput, { target: { value: 'New description' } })

  //     // Submit the edit form
  //     fireEvent.submit(form)

  //     // Form should be visible and not cleared
  //     await waitFor(() => expect(form).toBeVisible())
  //     await waitFor(() => expect(screen.queryByDisplayValue('New description')).toBeVisible())

  //     // The game should still appear in the list under its old name
  //     await waitFor(() => expect(screen.queryByText(name)).toBeVisible())

  //     // No flash message should be displayed, either for the validation error
  //     // or for the CORS error that will be raised if this test makes an API
  //     // request (since it isn't expected to)
  //     await waitFor(() => expect(screen.queryByText(/success/i)).not.toBeInTheDocument())
  //     await waitFor(() => expect(screen.queryByText(/error\(s\)/i)).not.toBeInTheDocument())
  //     await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).not.toBeInTheDocument())
  //   })
  // })

  describe("when the game doesn't exist", () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
        return res(
          ctx.status(404)
        )
      })
    )

    const { name, description } = games[0]

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("displays a flash error and doesn't update the name", async () => {
      component = renderComponentWithMockCookies()

      const gameTitle = await screen.findByText(name)
      const gameEl = gameTitle.closest('.root')

      // The icon you click to display the form
      const editIcon = within(gameEl).getByTestId('game-edit-icon')

      // Display the edit form
      fireEvent.click(editIcon)

      const form = await screen.findByTestId('game-form')
      const nameInput = within(form).getByDisplayValue(name)
      const descInput = within(form).getByDisplayValue(description)

      // Fill out the inputs
      fireEvent.change(nameInput, { target: { value: 'Changed Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })

      // Submit the edit form
      fireEvent.submit(form)

      // Form should be hidden
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // Flash message should be displayed
      await waitFor(() => expect(screen.queryByText(/couldn't find/i)).toBeVisible())

      // The game should no longer appear in the list under its old name
      await waitFor(() => expect(screen.queryByText('Changed Name')).not.toBeInTheDocument())

      // It should be in the list under its original name
      expect(screen.queryByText(name)).toBeVisible()
    })
  })

  describe('with invalid attributes', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            errors: ['Name must be unique']
          })
        )
      })
    )

    const { name, description } = games[0]

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("shows an error and hides the form but doesn't update the game", async () => {
      component = renderComponentWithMockCookies()

      const gameTitle = await screen.findByText(name)
      const gameEl = gameTitle.closest('.root')

      // The icon you click to display the form
      const editIcon = within(gameEl).getByTestId('game-edit-icon')

      // Display the edit form
      fireEvent.click(editIcon)

      const form = await screen.findByTestId('game-form')
      const nameInput = within(form).getByDisplayValue(name)
      const descInput = within(form).getByDisplayValue(description)

      // Fill out the inputs
      fireEvent.change(nameInput, { target: { value: 'Changed Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })

      // Submit the edit form
      fireEvent.submit(form)

      // The form should be hidden
      await waitFor(() => expect(form).not.toBeVisible())

      // There should be a flash error message displaying the validation errors
      await waitFor(() => expect(screen.queryByText(/Name must be unique/)).toBeVisible())

      // The game element should still contain its original name
      await waitFor(() => expect(gameEl).toHaveTextContent(name))

      // There should be one game that has the new name because the new name
      // is a duplicate
      const gamesWithNewName = await screen.queryAllByText(games[1].name)
      expect(gamesWithNewName.length).toEqual(1)
    })
  })

  describe('when there is an unexpected error', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            errors: ['Something went horribly wrong']
          })
        )
      })
    )

    const { name, description } = games[0]

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("displays a flash error and doesn't update the name", async () => {
      component = renderComponentWithMockCookies()

      const gameTitle = await screen.findByText(name)
      const gameEl = gameTitle.closest('.root')

      // The icon you click to display the form
      const editIcon = within(gameEl).getByTestId('game-edit-icon')

      // Display the edit form
      fireEvent.click(editIcon)

      const form = await screen.findByTestId('game-form')
      const nameInput = within(form).getByDisplayValue(name)
      const descInput = within(form).getByDisplayValue(description)

      // Fill out the inputs
      fireEvent.change(nameInput, { target: { value: 'Changed Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })

      // Submit the edit form
      fireEvent.submit(form)

      // Form should be hidden
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // The game should appear in the list under its old name
      await waitFor(() => expect(gameEl).toHaveTextContent(name))

      // Flash message should be displayed
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
    })
  })

  describe('when the server indicates the user has been logged out', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            errors: ['Googlee OAuth token validation failed']
          })
        )
      })
    )

    const { name, description } = games[0]

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies()

      const gameTitle = await screen.findByText(name)
      const gameEl = gameTitle.closest('.root')

      // The icon you click to display the form
      const editIcon = within(gameEl).getByTestId('game-edit-icon')

      // Display the edit form
      fireEvent.click(editIcon)

      const form = await screen.findByTestId('game-form')
      const nameInput = within(form).getByDisplayValue(name)
      const descInput = within(form).getByDisplayValue(description)

      // Fill out the inputs
      fireEvent.change(nameInput, { target: { value: 'Changed Name' } })
      fireEvent.change(descInput, { target: { value: 'New description' } })

      // Submit the edit form
      fireEvent.submit(form)

      // The user should be redirected to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })
})
