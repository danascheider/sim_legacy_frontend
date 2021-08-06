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

describe('Updating a shopping list item - error cases', () => {
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

  describe('when the server returns a 401 error', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            errors: ['Google OAuth token validation failed']
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('redirects the user to the login page', async () => {
      const { history } = component = renderComponentWithMockCookies()

      // We're going to update an item on the 'Lakeview Manor' list
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      fireEvent.click(listTitleEl)

      // The list item we're going for is titled 'Ingredients with "Frenzy"
      // property'. Its initial quantity is 4.
      const itemDescEl = await within(listEl).findByText(/frenzy/i)
      const itemEl = itemDescEl.closest('.root')
      const editIcon = within(itemEl).getByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-form')
      expect(form).toBeVisible()

      // Now find the form fields and fill out the form. This item has no notes
      // so we find the notes field by placeholder text instead.
      const notesField = within(form).getByPlaceholderText('This item has no notes')

      // Fill out the form field. We'll change just the notes value for the
      // sake of simplicity.
      fireEvent.change(notesField, { target: { value: 'This item has notes now' } })

      // Submit the  form
      fireEvent.submit(form)

      // The user should be redirected to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  describe('when the server returns a 404 error', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
        return res(
          ctx.status(404)
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("doesn't update the items and displays a flash error message", async () => {
      component = renderComponentWithMockCookies()

      // We're going to update an item on the 'Lakeview Manor' list
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      fireEvent.click(listTitleEl)

      // The list item we're going for is titled 'Ingredients with "Frenzy"
      // property'. Its initial quantity is 4 and it has no notes.
      const itemDescEl = await within(listEl).findByText(/frenzy/i)
      const itemEl = itemDescEl.closest('.root')
      const editIcon = within(itemEl).getByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-form')
      expect(form).toBeVisible()

      // Now find the form fields and fill out the form. This item has no notes
      // so we find the notes field by placeholder text instead.
      const notesField = within(form).getByPlaceholderText('This item has no notes')

      // Fill out the form field. We'll change just the notes value for the
      // sake of simplicity.
      fireEvent.change(notesField, { target: { value: 'This item has notes now' } })

      // Submit the form
      fireEvent.submit(form)

      // The form should be hidden 
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // Now we need to find the item on the regular list and the
      // aggregate list.
      const aggListTitleEl = screen.getByText('All Items')
      const aggListEl = aggListTitleEl.closest('.root')

      // Expand the list so the item is visible
      fireEvent.click(aggListTitleEl)

      // Then find the corresponding item
      const aggListItemDescEl = await within(aggListEl).findByText(/frenzy/i)
      const aggListItemEl = aggListItemDescEl.closest('.root')

      // Expand the list item on each list to see the notes
      fireEvent.click(aggListItemDescEl)
      fireEvent.click(itemDescEl)

      // Now we need to check that the aggregate list item and regular list
      // item are updated.
      await waitFor(() => expect(aggListItemEl).not.toHaveTextContent('This item has notes now'))
      expect(listEl).not.toHaveTextContent('This item has notes now')

      // Finally, it should display the flash message.
      await waitFor(() => expect(screen.queryByText(/couldn't find/i)).toBeVisible())
    })
  })

  describe('when the server returns a 422 error', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            errors: ['Quantity must be greater than zero']
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("doesn't update the items and displays a flash error message", async () => {
      component = renderComponentWithMockCookies()

      // We're going to update an item on the 'Lakeview Manor' list
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      fireEvent.click(listTitleEl)

      // The list item we're going for is titled 'Ingredients with "Frenzy"
      // property'. Its initial quantity is 4 and it has no notes.
      const itemDescEl = await within(listEl).findByText(/frenzy/i)
      const itemEl = itemDescEl.closest('.root')
      const editIcon = within(itemEl).getByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-form')
      expect(form).toBeVisible()

      // Now find the form fields and fill out the form.
      const quantityField = within(form).getByDisplayValue('4')

      // In this case we'll set it to an invalid value
      fireEvent.change(quantityField, { target: { value: '-6' } })

      // Submit the form
      fireEvent.submit(form)

      // The form should be hidden 
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // Now we need to find the item on the regular list and the
      // aggregate list.
      const aggListTitleEl = screen.getByText('All Items')
      const aggListEl = aggListTitleEl.closest('.root')

      // Expand the list so the item is visible
      fireEvent.click(aggListTitleEl)

      // Then find the corresponding item
      const aggListItemDescEl = await within(aggListEl).findByText(/frenzy/i)
      const aggListItemEl = aggListItemDescEl.closest('.root')

      // Expand the list item on each list to see the notes
      fireEvent.click(aggListItemDescEl)
      fireEvent.click(itemDescEl)

      // Now we need to check that the aggregate list item and regular list
      // item are updated.
      await waitFor(() => expect(within(aggListItemEl).queryByText('-6')).not.toBeInTheDocument())
      expect(within(listEl).queryByText('-6')).not.toBeInTheDocument()

      // Finally, it should display the flash message.
      await waitFor(() => expect(screen.queryByText(/Quantity must be greater than zero/)).toBeVisible())
    })
  })

  describe('when the server returns a 500 error', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            errors: ['Something went horribly wrong']
          })
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it("doesn't update the items and displays a flash error message", async () => {
      component = renderComponentWithMockCookies()

      // We're going to update an item on the 'Lakeview Manor' list
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      fireEvent.click(listTitleEl)

      // The list item we're going for is titled 'Ingredients with "Frenzy"
      // property'. Its initial quantity is 4 and it has no notes.
      const itemDescEl = await within(listEl).findByText(/frenzy/i)
      const itemEl = itemDescEl.closest('.root')
      const editIcon = within(itemEl).getByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-form')
      expect(form).toBeVisible()

      // Now find the form fields and fill out the form.
      const quantityField = within(form).getByDisplayValue('4')

      // In this case we'll set it to an invalid value
      fireEvent.change(quantityField, { target: { value: '-6' } })

      // Submit the form
      fireEvent.submit(form)

      // The form should be hidden 
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // Now we need to find the item on the regular list and the
      // aggregate list.
      const aggListTitleEl = screen.getByText('All Items')
      const aggListEl = aggListTitleEl.closest('.root')

      // Expand the list so the item is visible
      fireEvent.click(aggListTitleEl)

      // Then find the corresponding item
      const aggListItemDescEl = await within(aggListEl).findByText(/frenzy/i)
      const aggListItemEl = aggListItemDescEl.closest('.root')

      // Expand the list item on each list to see the notes
      fireEvent.click(aggListItemDescEl)
      fireEvent.click(itemDescEl)

      // Now we need to check that the aggregate list item and regular list
      // item are updated.
      await waitFor(() => expect(within(aggListItemEl).queryByText('-6')).not.toBeInTheDocument())
      expect(within(listEl).queryByText('-6')).not.toBeInTheDocument()

      // Finally, it should display the flash message.
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
    })
  })
})
