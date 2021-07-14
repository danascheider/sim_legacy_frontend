import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
import { renderWithRouter } from '../../setupTests'
import { AppProvider } from '../../contexts/appContext'
import DashboardPage from './dashboardPage'

describe('DashboardPage', () => {
  describe('when the user is not signed in', () => {
    const token = null

    beforeEach(() => {
      jest.mock('react-cookie', () => ({
        __esModule: true,
        useCookies: jest.fn(() => [{ '_sim_google_session': null }, () => {}, () => {}])
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
})
