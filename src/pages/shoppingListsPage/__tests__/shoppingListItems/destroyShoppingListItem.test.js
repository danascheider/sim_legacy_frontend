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
import {
  findAggregateList,
  findListByListItem,
  removeOrAdjustItemOnItemDestroy
} from '../../../../sharedTestUtilities'
import ShoppingListsPage from './../../shoppingListsPage'

describe('Destroying a shopping list item', () => {
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

  describe('when the user cancels when prompted', () => {
    let confirm

    beforeEach(() =>  confirm = jest.spyOn(window, 'confirm').mockImplementation(() => false))
    afterEach(() => confirm.mockRestore())

    it("doesn't remove the item from the regular list or the aggregate list", async () => {
      component = renderComponentWithMockCookies()

      // Start by finding the list the item is on. In this case, we'll be deleting the
      // item 'Ingredients with "Frenzy" property' from the list 'Lakeview Manor'.
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      // Expand the list to see the items
      fireEvent.click(listTitleEl)

      // Find the item on the list
      const regItemDescEl = await within(listEl).findByText(/frenzy/i)
      const regItemEl = regItemDescEl.closest('.root')

      const destroyIcon = await within(regItemEl).findByTestId('destroy-item')

      // Click on the destroy icon
      fireEvent.click(destroyIcon)

      // The user should have been prompted
      await waitFor(() => expect(confirm).toHaveBeenCalled())

      // The shopping list item should still be on the list
      await waitFor(() => expect(regItemEl).toBeVisible())

      // Find the aggregate list
      const aggListTitle = await screen.findByText('All Items')
      const aggListEl = aggListTitle.closest('.root')

      // Expand the aggregate list to show the list items
      fireEvent.click(aggListTitle)

      // The list item should still be on the aggregate list too
      await waitFor(() => expect(within(aggListEl).queryByText(/frenzy/i)).toBeVisible())

      // There should be a flash info message
      await waitFor(() => expect(screen.queryByText(/not deleted/i)).toBeVisible())
    })
  })

  describe('when the aggregate list item is also removed', () => {
    const server = setupServer(
      rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
        return res(
          ctx.status(204)
        )
      })
    )

    let confirm

    beforeAll(() => server.listen())

    beforeEach(() => {
      server.resetHandlers()

      // For this test, the user will confirm each time they are prompted
      confirm = jest.spyOn(window, 'confirm').mockImplementation(() => true)
    })

    afterEach(() => confirm.mockRestore())
    afterAll(() => server.close())

    it('removes the item from the regular list and the aggregate list', async () => {
      component = renderComponentWithMockCookies()

      // Start by finding the list the item is on. In this case, we'll be deleting the
      // item 'Ingredients with "Frenzy" property' from the list 'Lakeview Manor'.
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      // Expand the list to see the items
      fireEvent.click(listTitleEl)

      // Find the item on the list
      const regItemDescEl = await within(listEl).findByText(/frenzy/i)
      const regItemEl = regItemDescEl.closest('.root')

      const destroyIcon = await within(regItemEl).findByTestId('destroy-item')

      // Click on the destroy icon
      fireEvent.click(destroyIcon)

      // The user should have been prompted
      await waitFor(() => expect(confirm).toHaveBeenCalled())

      // The item should be removed from the regular list
      await waitForElementToBeRemoved(regItemEl)
      expect(regItemEl).not.toBeInTheDocument()

      // Find the aggregate list
      const aggListTitle = await screen.findByText('All Items')
      const aggListEl = aggListTitle.closest('.root')

      // Expand the aggregate list to show the list items
      fireEvent.click(aggListTitle)

      // The list item should not be on the aggregate list either
      await waitFor(() => expect(within(aggListEl).queryByText(/frenzy/i)).not.toBeInTheDocument())
    })
  })

  describe('when the aggregate list item is not removed', () => {
    const server = setupServer(
      rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
        const itemId = parseInt(req.params.id)
        const list = findListByListItem(allShoppingLists, itemId)
        const item = list.list_items.find(i => i.id === itemId)
        const aggList = findAggregateList(allShoppingLists, list.game_id)
        const aggListItem = aggList.list_items.find(i => i.description.toLowerCase() === item.description.toLowerCase())

        return res(
          ctx.status(200),
          ctx.json(removeOrAdjustItemOnItemDestroy(aggListItem, item))
        )
      })
    )

    let confirm

    beforeAll(() => server.listen())

    beforeEach(() => {
      server.resetHandlers()

      // For this test, the user will confirm each time they are prompted
      confirm = jest.spyOn(window, 'confirm').mockImplementation(() => true)
    })

    afterEach(() => confirm.mockRestore())
    afterAll(() => server.close())

    it('removes the item from the regular list but leaves it on the aggregate list', async () => {
      component = renderComponentWithMockCookies()

      // Start by finding the list the item is on. In this case, we'll be deleting the
      // item 'Ingredients with "Frenzy" property' from the list 'Lakeview Manor'.
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      // Expand the list to see the items
      fireEvent.click(listTitleEl)

      // Find the item on the list
      const regItemDescEl = await within(listEl).findByText('Ebony sword')
      const regItemEl = regItemDescEl.closest('.root')

      const destroyIcon = await within(regItemEl).findByTestId('destroy-item')

      // Click on the destroy icon
      fireEvent.click(destroyIcon)

      // The user should have been prompted
      await waitFor(() => expect(confirm).toHaveBeenCalled())

      // The item should be removed from the regular list
      await waitForElementToBeRemoved(regItemEl)
      expect(regItemEl).not.toBeInTheDocument()

      // Find the aggregate list
      const aggListTitle = await screen.findByText('All Items')
      const aggListEl = aggListTitle.closest('.root')

      // Expand the aggregate list to show the list items
      fireEvent.click(aggListTitle)

      // The list item should still be on the aggregate list
      await waitFor(() => expect(within(aggListEl).queryByText('Ebony sword')).toBeVisible())
    })
  })

  xdescribe('when the server returns a 401 error', () => {
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
      const editIcon = await within(itemEl).findByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-edit-form')
      await waitFor(() => expect(form).toBeVisible())

      // Now find the form fields and fill out the form. This item has no notes
      // so we find the notes field by placeholder text instead.
      const notesField = await within(form).findByPlaceholderText('This item has no notes')

      // Fill out the form field. We'll change just the notes value for the
      // sake of simplicity.
      fireEvent.change(notesField, { target: { value: 'This item has notes now' } })

      // Submit the  form
      fireEvent.submit(form)

      // The user should be redirected to the login page
      await waitFor(() => expect(history.location.pathname).toEqual('/login'))
    })
  })

  xdescribe('when the server returns a 404 error', () => {
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
      const editIcon = await within(itemEl).findByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-edit-form')
      await waitFor(() => expect(form).toBeVisible())

      // Now find the form fields and fill out the form. This item has no notes
      // so we find the notes field by placeholder text instead.
      const notesField = await within(form).findByPlaceholderText('This item has no notes')

      // Fill out the form field. We'll change just the notes value for the
      // sake of simplicity.
      fireEvent.change(notesField, { target: { value: 'This item has notes now' } })

      // Submit the form
      fireEvent.submit(form)

      // The form should be hidden 
      await waitForElementToBeRemoved(form)
      expect(form).not.toBeInTheDocument()

      // Now we need to find the item on the regular list and the
      // aggregate list.
      const aggListTitleEl = await screen.findByText('All Items')
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
      await waitFor(() => expect(within(aggListItemEl).queryByText('This item has notes now')).not.toBeInTheDocument())
      await waitFor(() => expect(within(listEl).queryByText('This item has notes now')).not.toBeInTheDocument())

      // Finally, it should display the flash message.
      await waitFor(() => expect(screen.queryByText(/couldn't find/i)).toBeVisible())
    })
  })

  xdescribe('when the server returns a 422 error', () => {
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
      const editIcon = await within(itemEl).findByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-edit-form')
      await waitFor(() => expect(form).toBeVisible())

      // Now find the form fields and fill out the form.
      const quantityField = await within(form).findByDisplayValue('4')

      // In this case we'll set it to an invalid value
      fireEvent.change(quantityField, { target: { value: '-6' } })

      // Submit the form
      fireEvent.submit(form)

      // The form should be hidden 
      await waitForElementToBeRemoved(form)
      expect(form).not.toBeInTheDocument()

      // Now we need to find the item on the regular list and the
      // aggregate list.
      const aggListTitleEl = await screen.findByText('All Items')
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
      await waitFor(() => expect(within(listEl).queryByText('-6')).not.toBeInTheDocument())

      // Finally, it should display the flash message.
      await waitFor(() => expect(screen.queryByText(/Quantity must be greater than zero/)).toBeVisible())
    })
  })

  xdescribe('when the server returns a 500 error', () => {
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
      const editIcon = await within(itemEl).findByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-edit-form')
      await waitFor(() => expect(form).toBeVisible())

      // Now find the form fields and fill out the form.
      const quantityField = await within(form).findByDisplayValue('4')

      // In this case we'll set it to an invalid value
      fireEvent.change(quantityField, { target: { value: '-6' } })

      // Submit the form
      fireEvent.submit(form)

      // The form should be hidden 
      await waitForElementToBeRemoved(form)
      expect(form).not.toBeInTheDocument()

      // Now we need to find the item on the regular list and the
      // aggregate list.
      const aggListTitleEl = await screen.findByText('All Items')
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
      await waitFor(() => expect(within(listEl).queryByText('-6')).not.toBeInTheDocument())

      // Finally, it should display the flash message.
      await waitFor(() => expect(screen.queryByText(/something unexpected happened/i)).toBeVisible())
    })
  })
})
