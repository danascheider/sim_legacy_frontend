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

describe('Decrementing a shopping list item - happy path', () => {
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

  describe('when the new quantity would be greater than zero', () => {
    const server = setupServer(
      rest.patch(`${backendBaseUri}/shopping_list_items/3`, (req, res, ctx) => {
        const listItem = allShoppingLists[1].list_items[1]
        const aggListItem = allShoppingLists[0].list_items.find(item => item.description.toLowerCase() === listItem.description.toLowerCase())
        const quantity = req.body.shopping_list_item.quantity
        const deltaQty = quantity - listItem.quantity

        const returnJson = [
          {
            ...aggListItem,
            quantity: aggListItem.quantity + deltaQty
          },
          {
            ...listItem,
            quantity: quantity
          }
        ]

        return res(
          ctx.status(200),
          ctx.json(returnJson)
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

    it('updates the requested item and the aggregate list', async () => {
      component = renderComponentWithMockCookies()

      // We're going to increment an item on the 'Lakeview Manor' list
      const listTitleEl = await screen.findByText('Lakeview Manor')
      const listEl = listTitleEl.closest('.root')

      fireEvent.click(listTitleEl)

      // The list item we're going for is titled 'Ingredients with "Frenzy"
      // property'. Its initial quantity is 4.
      const itemDescEl = await within(listEl).findByText(/frenzy/i)
      const itemEl = itemDescEl.closest('.root')
      const decrementer = within(itemEl).getByTestId('decrementer')

      fireEvent.click(decrementer)

      // It should decrement the value shown on the list item
      await waitFor(() => expect(within(itemEl).queryByText('3')).toBeVisible())

      // Now find the corresponding item on the aggregate list. Start by
      // finding the list itself.
      const aggListTitleEl = screen.getByText('All Items')
      const aggListEl = aggListTitleEl.closest('.root')

      // Expand the list
      fireEvent.click(aggListTitleEl)

      // Then find the corresponding item
      const aggListItemDescEl = await within(aggListEl).findByText(/frenzy/i)
      const aggListItemEl = aggListItemDescEl.closest('.root')

      // Now we need to check its quantity. The quantity of this item
      // on the aggregate list is the same as the quantity on the regular
      // list, so the quantity we're looking for is '3' here as well.
      await waitFor(() => expect(within(aggListItemEl).queryByText('3')).toBeVisible())
    })
  })

  describe('when the new quantity would be zero', () => {
    let confirm

    describe("when the user doesn't delete the item", () => {
      beforeEach(() => {
        confirm = jest.spyOn(window, 'confirm').mockImplementation(() => false)
      })

      afterEach(() => confirm.mockRestore())

      it("doesn't remove the item and displays a flash message", async () => {
        component = renderComponentWithMockCookies()

        // We're going to decrement an item on the 'Lakeview Manor' list
        const listTitleEl = await screen.findByText('Lakeview Manor')
        const listEl = listTitleEl.closest('.root')

        fireEvent.click(listTitleEl)

        // The list item we're going for is 'Ebony sword'. Its initial quantity
        // is 1.
        const itemDescEl = await within(listEl).findByText(/ebony sword/i)
        const itemEl = itemDescEl.closest('.root')
        const decrementer = within(itemEl).getByTestId('decrementer')

        fireEvent.click(decrementer)

        // The user should have been prompted if they want to delete the
        // item instead of changing the quantity to 0
        expect(confirm).toHaveBeenCalled()

        // The item should not be removed (since the user cancelled) and
        // there should be a flash message indicating it was not deleted.
        await waitFor(() => expect(itemEl).toBeVisible())
        expect(screen.queryByText(/not deleted/i)).toBeVisible()
      })
    })

    describe('when the user deletes the item when prompted', () => {
      describe('when the item on the aggregate list is not destroyed', () => {
        const server = setupServer(
          rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
            const itemId = parseInt(req.params.id)
            const regList = allShoppingLists.find(list => !!list.list_items.find(li => li.id === itemId))
            const regListItem = regList.list_items.find(li => li.id === itemId)
            const aggregateListItem = allShoppingLists[0].list_items.find(item => item.description.toLowerCase() === regListItem.description.toLowerCase())

            const responseData = {
              ...aggregateListItem,
              quantity: 1
            }

            return res(
              ctx.status(200),
              ctx.json(responseData)
            )
          })
        )
        
        beforeAll(() => server.listen())

        beforeEach(() => {
          confirm = jest.spyOn(window, 'confirm').mockImplementation(() => true)
        })

        afterEach(() => {
          confirm.mockRestore()
        })

        afterAll(() => server.close())

        it('removes the item and gives a flash message', async () => {
          component = renderComponentWithMockCookies()

          // We're going to decrement an item on the 'Lakeview Manor' list
          const listTitleEl = await screen.findByText('Lakeview Manor')
          const listEl = listTitleEl.closest('.root')

          fireEvent.click(listTitleEl)

          // The list item we're going for is 'Ebony sword'. Its initial quantity
          // is 1.
          const itemDescEl = await within(listEl).findByText(/ebony sword/i)
          const itemEl = itemDescEl.closest('.root')
          const decrementer = within(itemEl).getByTestId('decrementer')

          fireEvent.click(decrementer)

          // The user should have been prompted if they want to delete the
          // item instead of changing the quantity to 0
          expect(confirm).toHaveBeenCalled()

          // The item should be removed
          await waitFor(() => expect(itemEl).not.toBeInTheDocument())

          // Find the aggregate list
          const aggListTitleEl = await screen.findByText('All Items')
          const aggListEl = aggListTitleEl.closest('.root')
          
          // Expand the aggregate list
          fireEvent.click(aggListTitleEl)

          // Find the aggregate list item
          const aggListItemTitleEl = await within(aggListEl).findByText(/ebony sword/i)
          const aggListItemEl = aggListItemTitleEl.closest('.root')

          // The new quantity on the aggregate list should be 1
          expect(within(aggListItemEl).getByText('1')).toBeVisible()
        })
      })

      describe('when the item on the aggregate list is destroyed', () => {
        const server = setupServer(
          rest.delete(`${backendBaseUri}/shopping_list_items/:id`, (req, res, ctx) => {
            return res(
              ctx.status(204)
            )
          })
        )

        beforeAll(() => server.listen())

        beforeEach(() => {
          confirm = jest.spyOn(window, 'confirm').mockImplementation(() => true)
        })

        afterEach(() => {
          confirm.mockRestore()
        })

        afterAll(() => server.close())

        it('removes both list items', async () => {
          component = renderComponentWithMockCookies()

          // We're going to decrement an item on the 'Lakeview Manor' list
          const listTitleEl = await screen.findByText('Lakeview Manor')
          const listEl = listTitleEl.closest('.root')

          fireEvent.click(listTitleEl)

          // The list item we're going for is 'Copper and onyx circlet'. Its
          // initial quantity is 1 and there is no other matching item on
          // another list
          const itemDescEl = await within(listEl).findByText(/dwarven boots/i)
          const itemEl = itemDescEl.closest('.root')
          const decrementer = within(itemEl).getByTestId('decrementer')

          fireEvent.click(decrementer)

          // The user should have been prompted if they want to delete the
          // item instead of changing the quantity to 0
          expect(confirm).toHaveBeenCalled()

          // The item should be removed
          await waitFor(() => expect(itemEl).not.toBeInTheDocument())

          // Find the aggregate list
          const aggListTitleEl = await screen.findByText('All Items')
          const aggListEl = aggListTitleEl.closest('.root')
          
          // Expand the aggregate list
          fireEvent.click(aggListTitleEl)

          // Find the aggregate list item
          await waitFor(() => expect(within(aggListEl).queryByText(/dwarven boots/i)).not.toBeInTheDocument())
        })
      })
    })
  })
})
