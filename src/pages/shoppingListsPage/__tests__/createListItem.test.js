import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
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

describe('Creating a shopping list item', () => {
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

  beforeEach(() => cleanCookies())
  afterEach(() => component && component.unmount())

  describe('when there is no matching item on any shopping list', () => {
    const server = setupServer(
      rest.post(`${backendBaseUri}/shopping_lists/:listId/shopping_list_items`, (req, res, ctx) => {
        const listId = parseInt(req.params.listId)
        const description = req.body.shopping_list_item.description
        const quantity = req.body.shopping_list_item.quantity
        const notes = req.body.shopping_list_item.notes

        const json = [
          {
            id: 856,
            list_id: allShoppingLists[0].id,
            description,
            quantity,
            notes
          },
          {
            id: 855,
            list_id: listId,
            description,
            quantity,
            notes
          }
        ]

        return res(
          ctx.status(200),
          ctx.json(json)
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('adds the item to the list and hides the form', async () => {
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

      // Item should be added to the list
      const itemTitle = await within(listEl).findByText('Dwarven metal ingots')
      const itemElOnRegList = itemTitle.closest('.root')
      expect(itemTitle).toBeVisible()

      // Form should be hidden
      await waitFor(() => expect(form).not.toBeVisible())

      // Check that the attributes of the item on the list are correct
      fireEvent.click(itemTitle)

      await waitFor(() => expect(within(itemElOnRegList).queryByText('10')).toBeVisible())
      await waitFor(() => expect(within(itemElOnRegList).queryByText('To make bolts with')).toBeVisible())

      // The item should be added to the all items list - expand the list to see
      const allItemsTitle = await screen.findByText(/all items/i)
      const allItemsEl = allItemsTitle.closest('.root')

      fireEvent.click(allItemsTitle)

      const item = await within(allItemsEl).findByText('Dwarven metal ingots')
      const itemEl = item.closest('.root')

      expect(item).toBeVisible()
      
      fireEvent.click(item)

      await waitFor(() => expect(within(itemEl).queryByText('10')).toBeVisible())
      await waitFor(() => expect(within(itemEl).queryByText('To make bolts with')).toBeVisible())
    })
  })

  // describe('when there is a matching item on another list')
  // describe('when there is a matching item on the same list')
  // describe('when the shopping list is not found')
  // describe('when the given attributes are invalid')
  // describe('when there is an unexpected error')
  // describe('when the server indicates the user is logged out')
})
