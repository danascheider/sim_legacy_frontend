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
import { InventoryListsProvider } from '../../../contexts/inventoryListsContext'
import {
  profileData,
  games,
  emptyGames,
  emptyInventoryLists,
  allInventoryLists
} from '../../../sharedTestData'
import InventoryPage from '../inventoryPage'

describe('Displaying the inventory page', () => {
  let component

  const renderComponentWithMockCookies = (cookies, gameId = null, allGames = games) => {
    const route = gameId ? `/dashboard/inventory?game_id=${gameId}` : '/dashboard/inventory'

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games: allGames, gameLoadingState: 'done' }}>
            <InventoryListsProvider>
              <InventoryPage />
            </InventoryListsProvider>
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
      rest.get(`${backendBaseUri}/games/:id/inventory_lists`, (req, res, ctx) => {
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
        rest.get(`${backendBaseUri}/games/${games[0].id}/inventory_lists`, (req, res, ctx) => {
          const lists = allInventoryLists.filter(list => list.game_id === games[0].id)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('stays on the inventory lists page', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies)

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/inventory'))
      })

      it('displays inventory lists for the first game', async () => {
        component = renderComponentWithMockCookies(cookies)

        // games[0]'s inventory lists should be visible on the page
        await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())
        expect(screen.queryByText('Lakeview Manor')).toBeVisible()
        expect(screen.queryByText('Heljarchen Hall')).toBeVisible()
        expect(screen.queryByText('Breezehome')).toBeVisible()

        // games[1]'s inventory lists should not be visible
        expect(screen.queryByText('Windstad Manor')).not.toBeInTheDocument()
        expect(screen.queryByText('Hjerim')).not.toBeInTheDocument()
        expect(screen.queryByText(/no shopping lists/i)).not.toBeInTheDocument()
      })

      describe('toggling an inventory list', () => {
        it('starts out collapsed', async () => {
          component = renderComponentWithMockCookies(cookies)

          // Find the list element from the title "Lakeview Manor"
          const lakeviewManorList = await waitFor(() => screen.getByText('Lakeview Manor').closest('.root'))

          // The list items should not be visible initially
          expect(within(lakeviewManorList).getByText(/ebony sword/i)).not.toBeVisible()
          expect(within(lakeviewManorList).getByText(/nirnroot/i)).not.toBeVisible()
        })

        it('displays the list item descriptions but not notes or unit weights', async () => {
          component = renderComponentWithMockCookies(cookies)

          // Find the header of the "Lakeview Manor" list
          const lakeviewManor = await screen.findByText(/lakeview manor/i)

          // Use the header to find the list element itself
          const lakeviewManorList = lakeviewManor.closest('.root')

          // Click to toggle the list
          fireEvent.click(lakeviewManor)

          // The descriptions of the list items should be visible
          await waitFor(() => expect(within(lakeviewManorList).queryByText(/ebony sword/i)).toBeVisible())
          expect(within(lakeviewManorList).getByText(/nirnroot/i)).toBeVisible()

          // The "unit weight" and "notes" headers will only be visible if the
          // list items are expanded.
          const unitWeightLabels = within(lakeviewManorList).queryAllByText(/unit weight/i)
          
          for (let i = 0; i < unitWeightLabels.length; i++) {
            expect(unitWeightLabels[i]).not.toBeVisible()
          }

          const notesLabels = within(lakeviewManorList).queryAllByText(/notes/i)

          for (let i = 0; i < notesLabels.length; i++) {
            expect(notesLabels[i]).not.toBeVisible()
          }
        })

        it('collapses again when clicked a second time', async () => {
          component = renderComponentWithMockCookies(cookies)

          // Find the header of the "Lakeview Manor" list
          const lakeviewManor = await screen.findByText(/lakeview manor/i)

          // Use the header to find the list element itself
          const lakeviewManorList = lakeviewManor.closest('.root')

          // Click twice to expand and then collapse the list
          fireEvent.click(lakeviewManor)
          fireEvent.click(lakeviewManor)

          // The list items should not be visible
          await waitFor(() => expect(within(lakeviewManorList).queryByText(/ebony sword/i)).not.toBeVisible())
          expect(within(lakeviewManorList).getByText(/nirnroot/i)).not.toBeVisible()
        })

        describe('toggling a list item', () => {
          it('expands one item when you click on it', async () => {
            component = renderComponentWithMockCookies(cookies)

            // Find the header of the "Lakeview Manor" list
            const lakeviewManor = await screen.findByText(/lakeview manor/i)

            // Use the header to find the list element itself
            const lakeviewManorList = lakeviewManor.closest('.root')

            // Click to toggle the list
            fireEvent.click(lakeviewManor)

            // Find the item's description
            const ebonySwordText = await within(lakeviewManorList).findByText('Ebony sword')

            // Find the whole item element
            const ebonySwordItem = ebonySwordText.closest('.root')

            // Click the text to expand the list item
            fireEvent.click(ebonySwordText)

            // The clicked item's unit weight should be visible
            await waitFor(() => expect(within(ebonySwordItem).queryByText('14')).toBeVisible())

            // The clicked item's notes should be visible
            expect(within(ebonySwordItem).queryByText(/notes 1/)).toBeVisible()

            // Notes for the other list item should not be visible
            expect(within(lakeviewManorList).queryByText(/no details available/i)).not.toBeVisible()
          })

          it('collapses the item when you click it again', async () => {
            component = renderComponentWithMockCookies(cookies)

            // Find the list element by its title
            const lakeviewManor = await screen.findByText('Lakeview Manor')
            const lakeviewManorList = lakeviewManor.closest('.root') // the list root

            // Find the list item (it'll be in the document even though it's not visible yet)
            const ebonySwordText = await within(lakeviewManorList).findByText('Ebony sword')
            const ebonySwordItem = ebonySwordText.closest('.root') // the list item root

            // Click the list title to expand the list
            fireEvent.click(lakeviewManor)

            // Click on the list item description twice to expand then collapse it again
            fireEvent.click(ebonySwordText)
            fireEvent.click(ebonySwordText)

            // The 'notes' value should not be visible
            await waitFor(() => expect(within(ebonySwordItem).queryByText('notes 1')).not.toBeVisible())

            // The 'unit weight' value should not be visible
            expect(within(ebonySwordItem).queryByText('14')).not.toBeVisible()
          })
        })
      })
    })

    describe('when a query string is given', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[1].id}/inventory_lists`, (req, res, ctx) => {
          const lists = allInventoryLists.filter(list => list.game_id === games[1].id)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('stays on the inventory lists page', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies, games[1].id)

        await waitFor(() => expect(history.location.pathname).toEqual('/dashboard/inventory'))
      })

      it('displays inventory lists for the specified game', async () => {
        component = renderComponentWithMockCookies(cookies, games[1].id)

        // The lists belonging to game 1 should be visible
        await waitFor(() => expect(screen.queryByText('All Items')).toBeVisible())
        expect(screen.getByText('Windstad Manor')).toBeVisible()
        expect(screen.getByText('Hjerim')).toBeVisible()

        // The lists belonging to game 0 should be absent
        expect(screen.queryByText('Lakeview Manor')).not.toBeInTheDocument()
        expect(screen.queryByText('Heljarchen Hall')).not.toBeInTheDocument()
        expect(screen.queryByText('Breezehome')).not.toBeInTheDocument()
        expect(screen.queryByText(/no inventory lists/i)).not.toBeInTheDocument()
      })
    })

    describe('when a game is selected from the dropdown', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/:gameId/inventory_lists`, (req, res, ctx) => {
          const gameId = parseInt(req.params.gameId)
          const lists = allInventoryLists.filter(list => list.game_id === gameId)

          return res(
            ctx.status(200),
            ctx.json(lists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('updates the query string and fetches the right inventory lists', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies)

        // Find the games dropdown and the button that expands the options
        const dropdownComponent = await screen.findByTestId('games-dropdown')
        const dropdownTrigger = screen.getByTestId('games-dropdown-trigger')

        // Expand the dropdown
        fireEvent.click(dropdownTrigger)

        // This game has a really long name so it will be truncated in the dropdown
        // and we can't look for the option with the whole name
        const gameOption = await within(dropdownComponent).findByText(/neque porro/i)

        // Select the game from the dropdown
        fireEvent.click(gameOption)

        // The query string should be updated so the game selected is the active one
        await waitFor(() => expect(history.location.search).toEqual(`?game_id=${games[1].id}`))

        // The lists belonging to gamee 1 should be visible
        await waitFor(() => expect(screen.getByText('Windstad Manor')).toBeVisible())
        expect(screen.getByText('Hjerim')).toBeVisible()
        expect(screen.getByText('All Items')).toBeVisible()

        // The lists belonging to game 0 should be absent
        expect(screen.queryByText('Lakeview Manor')).not.toBeInTheDocument()
        expect(screen.queryByText('Heljarchen Hall')).not.toBeInTheDocument()
        expect(screen.queryByText('Breezehome')).not.toBeInTheDocument()
        expect(screen.queryByText(/no shopping lists/i)).not.toBeInTheDocument()
      })
    })

    describe('when a game has no inventory lists', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/inventory_lists`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(emptyInventoryLists)
          )
        })
      )

      beforeAll(() => server.listen())
      beforeEach(() => server.resetHandlers())
      afterAll(() => server.close())

      it('displays a message that the game has no inventory lists', async () => {
        component = renderComponentWithMockCookies(cookies, games[0].id)

        await waitFor(() => expect(screen.queryByText(/no inventory lists/i)).toBeVisible())
      })
    })

    describe('when the user has no games', () => {
      it('tells the user they need to create a game', async () => {
        const { history } = component = renderComponentWithMockCookies(cookies, null, emptyGames)

        await waitFor(() => expect(screen.queryByText(/you need a game/i)).toBeVisible())
      })
    })

    describe('when the query string indicates a nonexistent game', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/:id/inventory_lists`, (req, res, ctx) => {
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
        rest.get(`${backendBaseUri}/games/:id/inventory_lists`, (req, res, ctx) => {
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

        await waitFor(() => expect(screen.queryByText(/there was an error/i)).toBeVisible())
      })
    })

    describe('when the response indicates the user has been logged out', () => {
      const server = setupServer(
        rest.get(`${backendBaseUri}/games/${games[0].id}/inventory_lists`, (req, res, ctx) => {
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
