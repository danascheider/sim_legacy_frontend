import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {  waitFor, screen, fireEvent } from '@testing-library/react'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../setupTests'
import { AppProvider } from '../../contexts/appContext'
import HomePage from './homePage'

describe('HomePage', () => {
  let component

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when the user is signed in', () => {
    const server = setupServer(
      rest.get('http://localhost:3000/auth/verify_token', (req, res, ctx) => {
        return res(ctx.status(204))
      }),
      rest.get('http://localhost:3000/users/current', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: 24,
            uid: 'dragonborn@gmail.com',
            email: 'dragonborn@gmail.com',
            name: 'Jane Doe',
            image_url: null
          })
        )
      })
    )

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the dashboard', async () => {
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

      await waitFor(() => expect(history.location.pathname).toEqual('/dashboard'))
    })
  })

  describe('when the user token is expired or invalid', () => {
    const server = setupServer(
      rest.get('http://localhost:3000/auth/verify_token', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation error'] })
        )
      })
    )

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('stays on the homepage', async () => {
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

      await waitFor(() => expect(history.location.pathname).toEqual('/'))
    })

    it('displays the homepage title', async () => {
      component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

      expect(screen.getByText(/skyrim inventory management/i)).toBeInTheDocument()
    })

    it('links to the login page', async () => {
      component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

      expect(screen.getByText(/log in with google/i)).toBeInTheDocument()
    })

    describe('clicking the login link', () => {
      it('goes to the login page', async () => {
        const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

        const link = await screen.getByText(/log in with google/i)
        fireEvent.click(link)
        await waitFor(() => expect(history.location.pathname).toEqual('/login'))
      })
    })
  })

  describe('when the user is not signed in', () => {
    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    it('stays on the homepage', async () => {
      const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

      await waitFor(() => expect(history.location.pathname).toEqual('/'))
    })

    it('displays the homepage title', async () => {
      component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

      expect(screen.getByText(/skyrim inventory management/i)).toBeInTheDocument()
    })

    it('links to the login page', async () => {
      component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

      expect(screen.getByText(/log in with google/i)).toBeInTheDocument()
    })

    describe('clicking the login link', () => {
      it('goes to the login page', async () => {
        const { history } = component = renderWithRouter(<CookiesProvider cookies={cookies}><AppProvider><HomePage /></AppProvider></CookiesProvider>)

        const link = screen.getByText(/log in with google/i)
        fireEvent.click(link)
        await waitFor(() => expect(history.location.pathname).toEqual('/login'))
      })
    })
  })
})
