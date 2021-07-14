import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {  waitFor, screen, fireEvent } from '@testing-library/react'
import { renderWithRouter } from '../../setupTests'
import { AppProvider } from '../../contexts/appContext'
import HomePage from './homePage'

describe('HomePage', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  describe('when the user is signed in', () => {
    const server = setupServer(
      rest.get('http://localhost:3000/auth/verify_token', (req, res, ctx) => {
        return res(ctx.status(204))
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = renderWithRouter(<AppProvider overrideValue={{ token: 'xxxxxx' }}><HomePage /></AppProvider>)

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

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('stays on the homepage', async () => {
      const { history } = renderWithRouter(<AppProvider overrideValue={{ token: 'xxxxxx' }}><HomePage /></AppProvider>)

      await waitFor(() => expect(history.location.pathname).toEqual('/'))
    })

    it('displays the homepage title', async () => {
      renderWithRouter(<AppProvider overrideValue={{ token: 'xxxxxx' }}><HomePage /></AppProvider>)
      
      expect(screen.getByText(/skyrim inventory management/i)).toBeInTheDocument()
    })

    it('links to the login page', async () => {
      renderWithRouter(<AppProvider overrideValue={{ token: 'xxxxxx' }}><HomePage /></AppProvider>)

      expect(screen.getByText(/log in with google/i)).toBeInTheDocument()
    })

    describe('clicking the login link', () => {
      it('goes to the login page', async () => {
        const { history } = renderWithRouter(<AppProvider overrideValue={{ token: 'xxxxxx' }}><HomePage /></AppProvider>)

        const link = await screen.getByText(/log in with google/i)
        fireEvent.click(link)
        await waitFor(() => expect(history.location.pathname).toEqual('/login'))
      })
    })
  })

  describe('when the user is not signed in', () => {
    it('stays on the homepage', async () => {
      const { history } = renderWithRouter(<AppProvider overrideValue={{ token: null }}><HomePage /></AppProvider>)

      await waitFor(() => expect(history.location.pathname).toEqual('/'))
    })

    it('displays the homepage title', async () => {
      renderWithRouter(<AppProvider overrideValue={{ token: null }}><HomePage /></AppProvider>)

      expect(screen.getByText(/skyrim inventory management/i)).toBeInTheDocument()
    })

    it('links to the login page', async () => {
      renderWithRouter(<AppProvider overrideValue={{ token: null }}><HomePage /></AppProvider>)

      expect(screen.getByText(/log in with google/i)).toBeInTheDocument()
    })

    describe('clicking the login link', () => {
      it('goes to the login page', async () => {
        const { history } = renderWithRouter(<AppProvider overrideValue={{ token: null }}><HomePage /></AppProvider>)

        const link = await screen.getByText(/log in with google/i)
        fireEvent.click(link)
        await waitFor(() => expect(history.location.pathname).toEqual('/login'))
      })
    })
  })
})
