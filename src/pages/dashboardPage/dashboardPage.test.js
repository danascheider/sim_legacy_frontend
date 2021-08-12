import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../setupTests'
import { AppProvider } from '../../contexts/appContext'
import DashboardPage from './dashboardPage'

describe('DashboardPage', () => {
  let component

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when the user is not signed in', () => {
    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    it('redirects to the login page', async () => {
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user token is expired or invalid', () => {
    const server = setupServer(
      rest.get('http://localhost:3000/users/current', (req, res, ctx) => {
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
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

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

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('stays on the dashboard', async () => {
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

      await waitFor(() => expect(history.location.pathname).toEqual('/dashboard'))
    })

    it('displays the user name', async () => {
      component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

      await waitFor(() => expect(screen.queryByText('Jane Doe')).toBeVisible())
    })

    it('displays the user email', async () => {
      component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

      await waitFor(() => expect(screen.queryByText('dragonborn@gmail.com')).toBeVisible())
    })

    it('displays the link to the games page', async () => {
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

      const element = await screen.findByText(/Your Games/)

      fireEvent.click(element)

      await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
    })

    it('displays the link to the shopping list page', async () => {
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

      const element = await screen.findByText(/Your Shopping Lists/)

      fireEvent.click(element)

      await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/shopping_lists'))
    })

    it('displays the link to the inventory page', async () => {
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

      const element = await screen.findByText(/Your Inventory/)

      fireEvent.click(element)

      await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/inventory'))
    })

    describe('logging out', () => {
      it('redirects to the homepage', async () => {
        const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider path='/dashboard'><DashboardPage /></AppProvider></CookiesProvider>, { route: '/dashboard' })

        const profile = await screen.findByText('Jane Doe')

        fireEvent.click(profile)

        const dropdown = await screen.findByText(/log out with google/i)

        fireEvent.click(dropdown)
        
        await waitFor(() => expect(history.location.pathname).toEqual('/'))
      })
    })
  })
})
