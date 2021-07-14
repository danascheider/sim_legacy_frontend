import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
import { renderWithRouter, mockCookies, mockWindowLocation } from '../../setupTests'
import { AppProvider } from '../../contexts/appContext'
import DashboardPage from './dashboardPage'

describe('DashboardPage', () => {
  let component

  afterEach(() => component && component.unmount())

  describe('when the user is not signed in', () => {
    it('redirects to the login page', async () => {
      const { history } = component = renderWithRouter(<AppProvider overrideValue={{ token: null }}><DashboardPage /></AppProvider>, { route: '/dashboard' })

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
      server.resetHandlers()
    })
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = component = renderWithRouter(<AppProvider><DashboardPage /></AppProvider>, { route: '/dashboard' })

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
    const oldCookies = window.document.cookies

    beforeAll(() => {
      server.listen()

      // Fix window location pathname because it was always evaluating to '/' in the AppProvider
      mockWindowLocation('/dashboard')
      mockCookies('_sim_google_session=xxxxxx')
    })

    beforeEach(() => {
      server.resetHandlers()
    })

    afterAll(() => {
      server.close()
      window.document.cookie = oldCookies
      window.location = oldWindowLocation
    })

    it('stays on the dashboard', async () => {
      const { history } = component = renderWithRouter(<AppProvider><DashboardPage /></AppProvider>, { route: '/dashboard' })

      await waitFor(() => expect(history.location.pathname).toEqual('/dashboard'))
    })

    it('displays the user name', async () => {
      component = renderWithRouter(<AppProvider><DashboardPage /></AppProvider>, { route: '/dashboard' })

      expect(await screen.findByText('Jane Doe')).toBeInTheDocument()
    })

    it('displays the user email', async () => {
      component = renderWithRouter(<AppProvider><DashboardPage /></AppProvider>, { route: '/dashboard' })

      expect(await screen.findByText('dragonborn@gmail.com')).toBeInTheDocument()
    })

    it('displays the link to the shopping list page', async () => {
      const { history } = component = renderWithRouter(<AppProvider><DashboardPage /></AppProvider>, { route: '/dashboard' })

      const element = await screen.findByText(/shopping lists/i)

      fireEvent.click(element)

      await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/shopping_lists'))
    })
  })
})
