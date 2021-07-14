import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
import { renderWithRouter } from '../../setupTests'
import { AppProvider } from '../../contexts/appContext'
import DashboardPage from './dashboardPage'

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  describe('when the user is not signed in', () => {
    beforeEach(() => {
      jest.mock('react-cookie', () => ({
        __esModule: true,
        useCookies: jest.fn(() => [{}, () => {}, () => {}])
      }))
    })

    it('redirects to the login page', async () => {
      const { history } = renderWithRouter(<AppProvider overrideValue={{ token: null }}><DashboardPage /></AppProvider>, { route: '/dashboard' })

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user token is expired or invalid', () => {
    const server = setupServer(
      rest.get('http://localhost:3000/users/current', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation error'] })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => {
      jest.mock('react-cookie', () => ({
        __esModule: true,
        useCookies: jest.fn(() => [{ '_sim_google_session': 'xxxxxxx' }, () => {}, () => {}])
      }))
      server.resetHandlers()
    })
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = renderWithRouter(<AppProvider><DashboardPage /></AppProvider>, { route: '/dashboard' })

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user is signed in', () => {
    const profileData = {
      id: 24,
      uid: 'dragonborn@gmail.com',
      email: 'dragonborn@gmail.com',
      name: 'Jane Doe',
      image_url: null
    }

    const server = setupServer(
      rest.get('http://localhost:3000/users/current', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(profileData)
        )
      })
    )

    const oldWindowLocation = window.location
    const oldCookies = window.document.cookie

    beforeAll(() => {
      server.listen()

      // Fix window location pathname because it was always evaluating to '/' in the AppProvider
      delete window.location
      window.location = Object.defineProperties(
        {},
        {
          ...Object.getOwnPropertyDescriptors(oldWindowLocation),
          pathname: {
            configurable: true,
            value: '/dashboard'
          }
        }
      )

      Object.defineProperty(window.document, 'cookie', { writable: true, value: '_sim_google_session=xxxxxx' })
    })

    beforeEach(() => {
      jest.mock('react-cookie', () => ({
        __esModule: true,
        useCookies: jest.fn(() => [{ '_sim_google_session': 'xxxxxx' }, () => {}, () => {}])
      }))

      server.resetHandlers()
    })
    afterAll(() => {
      server.close()
      Object.defineProperty(window.document, 'cookie', { writable: false, value: oldCookies })
    })

    it('stays on the dashboard', async () => {
      const { history } = renderWithRouter(<AppProvider overrideValue={{ token: 'xxxxxx' }}><DashboardPage /></AppProvider>, { route: '/dashboard' })

      await waitFor(() => expect(history.location.pathname).toEqual('/dashboard'))
    })

    it('displays the user name', async () => {
      renderWithRouter(<AppProvider overrideValue={{ token: 'xxxxxx' }}><DashboardPage /></AppProvider>, { route: '/dashboard' })

      const element = await screen.findByText('Jane Doe')

      expect(element).toBeInTheDocument()
    })

    it('displays the user email', async () => {
      renderWithRouter(<AppProvider overrideValue={{ token: 'xxxxxx' }}><DashboardPage /></AppProvider>, { route: '/dashboard' })

      const element = await screen.findByText('dragonborn@gmail.com')

      expect(element).toBeInTheDocument()
    })
  })
})
