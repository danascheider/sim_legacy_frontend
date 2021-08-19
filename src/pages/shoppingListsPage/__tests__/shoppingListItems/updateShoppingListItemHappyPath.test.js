import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { waitFor, screen, fireEvent } from '@testing-library/react'
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

describe('Updating a shopping list item - happy path', () => {
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

  describe('when not updating unit weight', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/shopping_list_items/3`, (req, res, ctx) => {
        const listItem = allShoppingLists[1].list_items[1]
        const aggListItem = allShoppingLists[0].list_items.find(item => item.description.toLowerCase() === listItem.description.toLowerCase())
        const quantity = parseInt(req.body.shopping_list_item.quantity)
        const notes = req.body.shopping_list_item.notes

        const returnJson = [
          {
            ...aggListItem,
            quantity,
            notes
          },
          {
            ...listItem,
            quantity,
            notes
          }
        ]

        return res(
          ctx.status(200),
          ctx.json(returnJson)
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('updates the requested item and the aggregate list', async () => {
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
      await waitFor(() => expect(aggListItemEl).toHaveTextContent('This item has notes now'))
      expect(listEl).toHaveTextContent('This item has notes now')

      // Finally, it should display the flash message.
      await waitFor(() => expect(screen.queryByText(/updated/i)).toBeVisible())
    })

    describe('cancelling editing with the Escape key', () => {
      it('hides the modal and form', async () => {
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

        // It should display the modal and form
        const modal = await screen.findByRole('dialog')
        const form = within(modal).getByTestId('shopping-list-item-form')
        expect(form).toBeVisible()

        // Now press the escape key to hide the modal
        fireEvent.keyDown(form, { key: 'Escape', code: 'Escape' })

        // The form should be hidden 
        await waitFor(() => expect(modal).not.toBeVisible())
      })
    })

    describe('cancelling editing by clicking outside the form', () => {
      it('hides the modal and form', async () => {
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

        // It should display the modal and form
        const modal = await screen.findByRole('dialog')
        const form = within(modal).getByTestId('shopping-list-item-form')
        expect(form).toBeVisible()

        // Now click on the modal element, outside the form, to hide it
        fireEvent.click(modal)

        // The form should be hidden 
        await waitFor(() => expect(modal).not.toBeVisible())
      })
    })
  })

  describe('when updating unit weight', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/shopping_list_items/1`, (req, res, ctx) => {
        const lists = allShoppingLists.filter(list => list.game_id === games[0].id)

        let response = []

        for (let i = 0; i < lists.length; i++) {
          const item = lists[i].list_items.find(li => li.description === 'Ebony sword')

          if (item) response.push({ ...item, unit_weight: 16.0 })
        }

        return res(
          ctx.status(200),
          ctx.json(response)
        )
      })
    )

    beforeAll(() => server.listen())
    beforeEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('updates all modified list items', async () => {
      component = renderComponentWithMockCookies()

      // We're going to update an item on the 'Lakeview Manor' list
      const lakeviewManorTitle = await screen.findByText('Lakeview Manor')
      const lakeviewManorList = lakeviewManorTitle.closest('.root')

      fireEvent.click(lakeviewManorTitle)

      // The list item we're going for is titled 'Ebony sword'.
      const itemDesc = await within(lakeviewManorList).findByText('Ebony sword')
      const itemEl = itemDesc.closest('.root')
      const editIcon = within(itemEl).getByTestId('edit-item')

      fireEvent.click(editIcon)

      // It should display the list item edit form
      const form = await screen.findByTestId('shopping-list-item-form')
      expect(form).toBeVisible()

      // Now find the form field and fill out the form. This item has no unit weight
      // so we find the notes field by placeholder text instead.
      const unitWeightField = within(form).getByPlaceholderText('Unit Weight')

      // Fill out the form field. We'll change just the unit weight value.
      fireEvent.change(unitWeightField, { target: { value: 16.0 } })

      // Submit the form
      fireEvent.submit(form)

      // The form should be hidden 
      await waitFor(() => expect(form).not.toBeInTheDocument())

      // Now we need to find the item on all the lists where it appears.
      // Start by finding the lists.
      const aggListTitle = screen.getByText('All Items')
      const aggList = aggListTitle.closest('.root')

      const heljarchenHallTitle = screen.getByText('Heljarchen Hall')
      const heljarchenHallList = heljarchenHallTitle.closest('.root')

      // Expand the lists so the item is visible
      fireEvent.click(aggListTitle)
      fireEvent.click(heljarchenHallTitle)

      // Then find the corresponding item
      const aggListItemDesc = await within(aggList).findByText('Ebony sword')
      const aggListItem = aggListItemDesc.closest('.root')

      const heljarchenHallListItemDesc = within(heljarchenHallList).getByText('Ebony sword')
      const heljarchenHallListItem = heljarchenHallListItemDesc.closest('.root')

      // Expand the list item on each list to see the notes
      fireEvent.click(aggListItemDesc)
      fireEvent.click(itemDesc)
      fireEvent.click(heljarchenHallListItemDesc)

      // Now we need to check that the aggregate list item and regular list
      // item are updated.
      await waitFor(() => expect(aggListItem).toHaveTextContent('16'))
      expect(itemEl).toHaveTextContent('16')
      expect(heljarchenHallListItem).toHaveTextContent('16')

      // Finally, it should display the flash message.
      await waitFor(() => expect(screen.queryByText(/updated/i)).toBeVisible())
    })
  })
})
