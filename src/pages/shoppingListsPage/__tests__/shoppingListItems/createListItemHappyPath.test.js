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

describe('Creating a shopping list item - happy path', () => {
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
  afterEach(() => component.unmount())

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

  describe('when there is a matching item on another list', () => {
    const server = setupServer(
      rest.post(`${backendBaseUri}/shopping_lists/${allShoppingLists[2].id}/shopping_list_items`, (req, res, ctx) => {
        const listId = allShoppingLists[2].id
        const description = req.body.shopping_list_item.description
        const quantity = req.body.shopping_list_item.quantity
        const notes = req.body.shopping_list_item.notes

        const allItemsListItem = allShoppingLists[0].list_items.find(item => item.description.toLowerCase() === description.toLowerCase())

        const json = [
          {
            ...allItemsListItem,
            quantity: allItemsListItem.quantity + quantity,
            notes: notes // just because in the existing matching item for this test the notes are null
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

    it('updates the list items and displays a flash message', async () => {
      component = renderComponentWithMockCookies()

      const listTitle = await screen.findByText('Heljarchen Hall')
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
      fireEvent.change(descriptionInput, { target: { value: 'Ingredients with "Frenzy" property' } })
      fireEvent.change(quantityInput, { target: { value: '5' } })
      fireEvent.change(notesInput, { target: { value: 'To make poison with' } })

      fireEvent.submit(form)

      // Item should be added to the list
      const itemTitle = await within(listEl).findByText('Ingredients with "Frenzy" property')
      const itemElOnRegList = itemTitle.closest('.root')
      expect(itemTitle).toBeVisible()

      // Form should be hidden
      await waitFor(() => expect(form).not.toBeVisible())

      // Check that the attributes of the item on the list are correct
      fireEvent.click(itemTitle)

      await waitFor(() => expect(within(itemElOnRegList).queryByText('5')).toBeVisible())
      await waitFor(() => expect(within(itemElOnRegList).queryByText('To make poison with')).toBeVisible())

      // The item should be updated on the all items list but should not appear
      // on the list twice.
      const allItemsTitle = await screen.findByText(/all items/i)
      const allItemsEl = allItemsTitle.closest('.root')

      fireEvent.click(allItemsTitle)

      const item = await within(allItemsEl).findByText('Ingredients with "Frenzy" property')
      const itemEl = item.closest('.root')

      expect(item).toBeVisible()
      
      fireEvent.click(item)

      await waitFor(() => expect(within(itemEl).queryByText('9')).toBeVisible())
      await waitFor(() => expect(within(itemEl).queryByText('To make poison with')).toBeVisible())
    })
  })

  describe('when there is a matching item on the same list', () => {
    const server = setupServer(
      rest.post(`${backendBaseUri}/shopping_lists/${allShoppingLists[1].id}/shopping_list_items`, (req, res, ctx) => {
        const listId = allShoppingLists[1].id
        const description = req.body.shopping_list_item.description
        const quantity = req.body.shopping_list_item.quantity
        const notes = req.body.shopping_list_item.notes

        const regularListItem = allShoppingLists[1].list_items.find(item => item.description.toLowerCase() === description.toLowerCase())
        const allItemsListItem = allShoppingLists[0].list_items.find(item => item.description.toLowerCase() === description.toLowerCase())

        const json = [
          {
            ...allItemsListItem,
            quantity: allItemsListItem.quantity + quantity,
            notes: `${allItemsListItem.notes} -- ${notes}`
          },
          {
            ...regularListItem,
            quantity: regularListItem.quantity + quantity,
            notes: `${regularListItem.notes} -- ${notes}`
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

    it('updates the list items and displays a flash message', async () => {
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
      fireEvent.change(descriptionInput, { target: { value: 'Ebony sword' } })
      fireEvent.change(quantityInput, { target: { value: '2' } })
      fireEvent.change(notesInput, { target: { value: 'notes 3' } })

      fireEvent.submit(form)

      // The item should be present on the list but should be there only once. The
      // findByText query will fail if there is more than one matching element.
      const itemTitle = await within(listEl).findByText('Ebony sword')
      const itemElOnRegList = itemTitle.closest('.root')
      expect(itemTitle).toBeVisible()

      // Form should be hidden
      await waitFor(() => expect(form).not.toBeVisible())

      // Check that the attributes of the item on the list are correct
      fireEvent.click(itemTitle)

      await waitFor(() => expect(within(itemElOnRegList).queryByText('3')).toBeVisible())
      await waitFor(() => expect(within(itemElOnRegList).queryByText('notes 1 -- notes 3')).toBeVisible())

      // The item should be on the all items list only once as well.
      const allItemsTitle = await screen.findByText(/all items/i)
      const allItemsEl = allItemsTitle.closest('.root')

      fireEvent.click(allItemsTitle)

      const item = await within(allItemsEl).findByText('Ebony sword')
      const itemEl = item.closest('.root')

      expect(itemEl).toBeVisible()
      
      fireEvent.click(item)

      await waitFor(() => expect(within(itemEl).queryByText('4')).toBeVisible())
      await waitFor(() => expect(within(itemEl).queryByText('notes 1 -- notes 2 -- notes 3')).toBeVisible())
    })
  })
  // describe('when the given attributes are invalid')
  // describe('when there is an unexpected error')
  // describe('when the server indicates the user is logged out')
})
