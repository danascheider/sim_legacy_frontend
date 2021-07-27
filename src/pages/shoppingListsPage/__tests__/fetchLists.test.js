import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../setupTests'
import { backendBaseUri } from '../../../utils/config'
import { AppProvider } from '../../../contexts/appContext'
import { GamesProvider } from '../../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../../contexts/shoppingListsContext'
import {
  profileData,
  games,
  emptyGames,
  emptyShoppingLists,
  allShoppingLists
} from '../../../sharedTestData'
import ShoppingListsPage from '../shoppingListsPage'

describe('Displaying the shopping lists page', () => {
  let component

  const renderComponentWithMockCookies = (cookies, gameId = null, allGames = games) => {
    const route = gameId ? `/dashboard/shopping_lists?game_id=${gameId}` : '/dashboard/shopping_lists'

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games: allGames, gameLoadingState: 'done' }} >
            <ShoppingListsProvider>
              <ShoppingListsPage />
            </ShoppingListsProvider>
          </GamesProvider>
        </AppProvider>
      </CookiesProvider>,
      { route }
    )
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
    const cookies = new Cookies()
    cookies.HAS_DOCUMENT_COOKIE = false

    const server = setupServer(
      rest.get(`${backendBaseUri}/games/:id/shopping_lists`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ['Google OAuth token validation failed'] })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies(cookies)

      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the user is signed in', () => {
    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    describe('when no query string is given', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/shopping_lists`, (req, res, ctx) => {
          const lists = allShoppingLists.filter(list => list.game_id === games[0].id)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('stays on the shopping lists page', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies)

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/shopping_lists'))
      })

      it('displays shopping lists for the first game', async () => {
        component = renderComponentWithMockCookies(cookies)

        // games[0]'s shopping lists should be visible on the page
        await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Lakeview Manor')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Heljarchen Hall')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Breezehome')).toBeVisible())

        // games[1]'s shopping lists should not be visible
        await waitFor(() => expect(screen.queryByText('Windstad Manor')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText('Hjerim')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText(/no shopping lists/i)).not.toBeInTheDocument())
      })

      describe('toggling a shopping list', () => {
        it('starts out collapsed', async () => {
          component = renderComponentWithMockCookies(cookies)

          // Using findByText I got 'closest is not a function', presumably because findByText
          // returns a promise, so I had to use waitFor ... getByText instead.
          const lakeviewManorList = await waitFor(() => screen.getByText('Lakeview Manor').closest('.root'))

          await waitFor(() => expect(within(lakeviewManorList).queryByText(/add item to list/i)).not.toBeVisible())
          await waitFor(() => expect(within(lakeviewManorList).queryByText(/ebony sword/i)).not.toBeVisible())
          await waitFor(() => expect(within(lakeviewManorList).queryByText(/ingredients with "frenzy" property/i)).not.toBeVisible())
        })

        it('displays the list item descriptions but not notes', async () => {
          component = renderComponentWithMockCookies(cookies)

          const lakeviewManor = await screen.findByText(/lakeview manor/i)
          const lakeviewManorList = lakeviewManor.closest('.root')

          fireEvent.click(lakeviewManor)

          await waitFor(() => expect(within(lakeviewManorList).queryByText(/add item to list/i)).toBeVisible())
          await waitFor(() => expect(within(lakeviewManorList).queryByText(/ebony sword/i)).toBeVisible())
          await waitFor(() => expect(within(lakeviewManorList).queryByText(/ingredients with "frenzy" property/i)).toBeVisible())
        })

        it('collapses again when clicked a second time', async () => {
          component = renderComponentWithMockCookies(cookies)

          const lakeviewManor = await screen.findByText(/lakeview manor/i)
          const lakeviewManorList = lakeviewManor.closest('.root')

          fireEvent.click(lakeviewManor)
          fireEvent.click(lakeviewManor)

          await waitFor(() => expect(within(lakeviewManorList).queryByText(/add item to list/i)).not.toBeVisible())
          await waitFor(() => expect(within(lakeviewManorList).queryByText(/ebony sword/i)).not.toBeVisible())
          await waitFor(() => expect(within(lakeviewManorList).queryByText(/ingredients with "frenzy" property/i)).not.toBeVisible())
        })

        describe('toggling a list item', () => {
          it('is collapsed when the list is first expanded', async () => {
            component = renderComponentWithMockCookies(cookies)

            const lakeviewManor = await screen.findByText('Lakeview Manor')
            const lakeviewManorList = lakeviewManor.closest('.root')

            fireEvent.click(lakeviewManor)

            await waitFor(() => expect(within(lakeviewManorList).queryByText(/notes 1/i)).not.toBeVisible())
            await waitFor(() => expect(within(lakeviewManorList).queryByText(/no details available/i)).not.toBeVisible())
          })

          it('expands one item when you click on it', async () => {
            component = renderComponentWithMockCookies(cookies)

            const lakeviewManor = await screen.findByText('Lakeview Manor')
            const lakeviewManorList = lakeviewManor.closest('.root') // the list root

            fireEvent.click(lakeviewManor)

            const ebonySwordText = await within(lakeviewManorList).findByText('Ebony sword')
            const ebonySwordItem = ebonySwordText.closest('.root') // the list item root

            fireEvent.click(ebonySwordText)

            // Notes for the clicked item should be visible
            await waitFor(() => expect(within(ebonySwordItem).queryByText('notes 1')).toBeVisible())

            // Notes for the other item should not be visible
            await waitFor(() => expect(within(lakeviewManorList).queryByText(/no details available/i)).not.toBeVisible())
          })

          it('collapses the item when you click it again', async () => {
            component = renderComponentWithMockCookies(cookies)

            const lakeviewManor = await screen.findByText('Lakeview Manor')
            const lakeviewManorList = lakeviewManor.closest('.root') // the list root

            const ebonySwordText = await within(lakeviewManorList).findByText('Ebony sword')
            const ebonySwordItem = ebonySwordText.closest('.root') // the list item root

            fireEvent.click(lakeviewManor)
            fireEvent.click(ebonySwordText)
            fireEvent.click(ebonySwordText)

            await waitFor(() => expect(within(ebonySwordItem).queryByText('notes 1')).not.toBeVisible())
          })
        })
      })
    })

    describe('when a query string is given', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[1].id}/shopping_lists`, (req, res, ctx) => {
          const lists = allShoppingLists.filter(list => list.game_id === games[1].id)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('stays on the shopping lists page', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies, games[1].id)

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/shopping_lists'))
      })

      it('displays shopping lists for the specified game', async () => {
        component = renderComponentWithMockCookies(cookies, games[1].id)

        // The lists belonging to game 1 should be visible
        await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Windstad Manor')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Hjerim')).toBeVisible())

        // The lists belonging to game 0 should be absent
        await waitFor(() => expect(screen.queryByText('Lakeview Manor')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText('Heljarchen Hall')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText('Breezehome')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText(/no shopping lists/i)).not.toBeInTheDocument())
      })
    })

    describe('when a game is selected from the dropdown', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
          const gameId = parseInt(req.params.gameId)
          const lists = allShoppingLists.filter(list => list.game_id === gameId)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('updates the query string and fetches the right shopping lists', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies)

        const dropdownComponent = await screen.findByTestId('games-dropdown')
        const dropdownTrigger = await screen.findByTestId('games-dropdown-trigger')

        fireEvent.click(dropdownTrigger)

        // This game has a really long name so it will be truncated in the dropdown
        // so we can't look for the option with the whole name.
        const gameOption = await within(dropdownComponent).findByText(/neque porro/i)

        fireEvent.click(gameOption)

        await waitFor(() => expect(history.location.search).toEqual(`?game_id=${games[1].id}`))

        // The lists belonging to game 1 should be visible
        await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Windstad Manor')).toBeVisible())
        await waitFor(() => expect(screen.queryByText('Hjerim')).toBeVisible())

        // The lists belonging to game 0 should be absent
        await waitFor(() => expect(screen.queryByText('Lakeview Manor')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText('Heljarchen Hall')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText('Breezehome')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByText(/no shopping lists/i)).not.toBeInTheDocument())
      })
    })

    describe('when a game has no shopping lists', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/shopping_lists`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(emptyShoppingLists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('displays a message that the game has no shopping lists', async () => {
        component = renderComponentWithMockCookies(cookies, games[0].id)

        await waitFor(() => expect(screen.queryByText(/no shopping lists/i)).toBeVisible())
      })
    })

    describe('when the user has no games', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/shopping_lists`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(emptyShoppingLists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('displays a link to create a game', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies, null, emptyGames)

        const link = await screen.findByText(/create a game/i)

        fireEvent.click(link)

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/games'))
      })
    })

    describe('when the query string indicates a nonexistent game', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/:id/shopping_lists`, (req, res, ctx) => {
          return res(
            ctx.status(404)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('indicates the game could not be found', async () => {
        component = renderComponentWithMockCookies(cookies, 4582)

        await waitFor(() => expect(screen.queryByText(/couldn't find the game/i)).toBeVisible())
      })
    })

    describe('when something unexpected goes wrong fetching games', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/:id/shopping_lists`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ errors: ['Something went horribly wrong'] })
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('displays an error', async () => {
        component = renderComponentWithMockCookies(cookies, 4582)

        await waitFor(() => expect(screen.queryByText(/unexpected error/i)).toBeVisible())
      })
    })

    describe('when the response indicates the user has been logged out', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/shopping_lists`, (req, res, ctx) => {
          return res(
            ctx.status(401)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('redirects to the login page', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies)

        await waitFor(() => expect(history.location.pathname).toEqual('/login'))
      })
    })
  })
})
