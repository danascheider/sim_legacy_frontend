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
import { profileData, games } from '../../../sharedTestData'
import GamesPage from '../gamesPage'

describe('Creating a game on the games page', () => {
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

  describe('successful creation', () => {
    const server = setupServer(
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

    it('adds the game to the list and hides the form', async () => {
      component = renderComponentWithMockCookies()

      const toggleLink = await screen.findByText('Create Game...')

      fireEvent.click(toggleLink)

      const nameInput = await screen.findByLabelText('Name')
      const descInput = await screen.findByLabelText('Description')
      const form = await screen.findByTestId('game-create-form')

      fireEvent.change(nameInput, { target: { value: 'Another Game' } })
      fireEvent.change(descInput, { target: { value: 'New game description' } })
      fireEvent.submit(form)

      await waitFor(() => expect(screen.queryByText('Another Game')).toBeVisible())
      await waitFor(() => expect(form).not.toBeVisible())
    })
  })

  describe('with invalid attributes', () => {
    const server = setupServer(
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

    it('displays the error message and leaves the form as-is', async () => {
      component = renderComponentWithMockCookies()

      const toggleLink = await screen.findByText('Create Game...')

      fireEvent.click(toggleLink)

      const nameInput = await screen.findByLabelText('Name')
      const descInput = await screen.findByLabelText('Description')
      const form = await screen.findByTestId('game-create-form')

      fireEvent.change(nameInput, { target: { value: 'Another Game' } })
      fireEvent.change(descInput, { target: { value: 'New game description' } })
      fireEvent.submit(form)

      await waitFor(() => expect(screen.queryByText('Another Game')).not.toBeInTheDocument())
      await waitFor(() => expect(screen.queryByText(/Name must be unique/)).toBeVisible())
      await waitFor(() => expect(form).toBeVisible())
    })
  })

  describe('when something unexpected goes wrong', () => {
    const server = setupServer(
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

    it('displays a generic error message and hides the form', async () => {
      component = renderComponentWithMockCookies()

      const toggleLink = await screen.findByText('Create Game...')

      fireEvent.click(toggleLink)

      const nameInput = await screen.findByLabelText('Name')
      const descInput = await screen.findByLabelText('Description')
      const form = await screen.findByTestId('game-create-form')

      fireEvent.change(nameInput, { target: { value: 'Another Game' } })
      fireEvent.change(descInput, { target: { value: 'New game description' } })
      fireEvent.submit(form)

      await waitFor(() => expect(screen.queryByText('Another Game')).not.toBeInTheDocument())
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
      await waitFor(() => expect(form).not.toBeVisible())
    })
  })

  describe('when the server indicates the user is not logged in', () => {
    const server = setupServer(
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

    it('redirects the user to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies()

      const toggleLink = await screen.findByText('Create Game...')

      fireEvent.click(toggleLink)

      const nameInput = await screen.findByLabelText('Name')
      const descInput = await screen.findByLabelText('Description')
      const form = await screen.findByTestId('game-create-form')

      fireEvent.change(nameInput, { target: { value: 'Another Game' } })
      fireEvent.change(descInput, { target: { value: 'New game description' } })
      fireEvent.submit(form)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })
})
