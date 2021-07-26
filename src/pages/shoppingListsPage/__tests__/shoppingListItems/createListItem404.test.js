import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { cleanCookies } from 'universal-cookie/lib/utils'
import { Cookies, CookiesProvider } from 'react-cookie'
import { renderWithRouter } from '../../../../setupTests'
import { backendBaseUri } from '../../../../utils/config'
import { AppProvider } from '../../../../contexts/appContext'
import { GamesProvider } from '../../../../contexts/gamesContext'
import { ShoppingListsProvider } from '../../../../contexts/shoppingListsContext'
import { profileData, games, allShoppingLists } from '../../../../sharedTestData'
import ShoppingListsPage from './../../shoppingListsPage'

describe('Creating a shopping list item - when the server returns a 404', () => {
  let component

  const renderComponentWithMockCookies = () => {
    const route = `/dashboard/shopping_lists?game_id=${games[0].id}`

    const shoppingLists = allShoppingLists.filter(list => list.game_id === games[0].id)

    const cookies = new Cookies('_sim_google_session="xxxxxx"')
    cookies.HAS_DOCUMENT_COOKIE = false

    return renderWithRouter(
      <CookiesProvider cookies={cookies}>
        <AppProvider overrideValue={{ profileData }}>
          <GamesProvider overrideValue={{ games, gameLoadingState: 'done' }} >
            <ShoppingListsProvider overrideValue={{ shoppingLists, shoppingListLoadingState: 'done' }}>
              <ShoppingListsPage />
            </ShoppingListsProvider>
          </GamesProvider>
        </AppProvider>
      </CookiesProvider>,
      { route }
    )
  }

  const server = setupServer(
    rest.post(`${backendBaseUri}/shopping_lists/:listId/shopping_list_items`, (req, res, ctx) => {
      return res(
        ctx.status(404)
      )
    })
  )

  beforeAll(() => server.listen())

  beforeEach(() => {
    cleanCookies()
    server.resetHandlers()
  })

  afterEach(() => component.unmount())
  afterAll(() => server.close())

  it("doesn't add the item and displays an error message", async () => {
    component = renderComponentWithMockCookies()

    const listTitle = await screen.findByText('Lakeview Manor')
    const listEl = listTitle.closest('.root')

    // Expand the list element
    fireEvent.click(listTitle)

    const formTrigger = await within(listEl).findByText('Add item to list...')

    // Expand the form to add an item
    fireEvent.click(formTrigger)

    const descriptionInput = await within(listEl).findByPlaceholderText(/description/i)
    const quantityInput = await within(listEl).findByDisplayValue('1')
    const notesInput = await within(listEl).findByPlaceholderText(/notes/i)

    const form = descriptionInput.closest('form')

    // Fill out and submit the form
    fireEvent.change(descriptionInput, { target: { value: 'Dwarven metal ingots' } })
    fireEvent.change(quantityInput, { target: { value: '10' } })
    fireEvent.change(notesInput, { target: { value: 'To make bolts with' } })

    fireEvent.submit(form)

    // Form should be hidden
    await waitFor(() => expect(form).not.toBeVisible())

    // The item should not be added to the list
    expect(within(listEl).queryByText('Dwarven metal ingots')).not.toBeInTheDocument()

    //  There should be an error message
    await waitFor(() => expect(screen.queryByText(/couldn't find/i)).toBeVisible())
  })
})
