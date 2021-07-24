import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react-dom/test-utils'
import {
  waitFor,
  screen,
  waitForElementToBeRemoved,
  fireEvent
} from '@testing-library/react'
import { within } from '@testing-library/dom'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../setupTests'
import { backendBaseUri } from '../../../utils/config'
import { AppProvider } from '../../../contexts/appContext'
import { GamesProvider } from '../../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../../contexts/shoppingListsContext'
import { profileData, games, allShoppingLists } from '../../../sharedTestData'
import ShoppingListsPage from './../shoppingListsPage'

describe('Editing a shopping list', () => {
  let component

  const renderComponentWithMockCookies = (gameId = null, allGames = games) => {
    const route = gameId ? `/dashboard/shopping_lists?game_id=${gameId}` : '/dashboard/shopping_lists'

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

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

  const sharedHandlers = [
    rest.get(`${backendBaseUri}/games/:gameId/shopping_lists`, (req, res, ctx) => {
      const gameId = parseInt(req.params.gameId)
      const lists = allShoppingLists.filter(list => list.game_id === gameId)

      return res(
        ctx.status(200),
        ctx.json(lists)
      )
    })
  ]

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('showing and hiding the form', () => {
    const server = setupServer.apply(null, sharedHandlers)

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('displays without toggling the list items when you click the edit icon', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      const list = allShoppingLists.filter(list => list.game_id === games[0].id)[1]

      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = await within(listEl).findByTestId(`edit-shopping-list-${list.id}`)

      fireEvent.click(editIcon)

      await waitFor(() => expect(within(listEl).queryByText(list.list_items[0].description)).not.toBeVisible())
      await waitFor(() => expect(within(listEl).queryByText(list.list_items[1].description)).not.toBeVisible())
      await waitFor(() => expect(within(listEl).queryByDisplayValue(list.title)).toBeVisible())
    })

    it('hides the form again when you click outside', async () => {
      component = renderComponentWithMockCookies(games[0].id)

      const list = allShoppingLists.filter(list => list.game_id === games[0].id)[1]

      const listTitleEl = await screen.findByText(list.title)
      const listEl = listTitleEl.closest('.root')
      const editIcon = await within(listEl).findByTestId(`edit-shopping-list-${list.id}`)

      fireEvent.click(editIcon)

      const form = await within(listEl).queryByDisplayValue(list.title)

      fireEvent.click(listEl) // it could be anywhere but you have to specify

      await waitFor(() => expect(form).not.toBeInTheDocument())
    })
  })

  describe('when all goes as planned', () => {
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

    xit('edits the shopping list and hides the form', async () => {
      component = renderComponentWithMockCookies(games[0].id)
    })
  })
})
