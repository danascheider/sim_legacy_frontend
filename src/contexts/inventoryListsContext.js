/*
 *
 * For more information about contexts and how they are used in SIM,
 * visit the docs on SIM contexts (/docs/contexts.md)
 * 
 * This context makes heavy use of the SIM API. The requests it makes are
 * mediated through the simApi module (/src/utils/simApi.js). To get information
 * about the API, its requirements, and its responses, visit the docs:
 * https://github.com/danascheider/skyrim_inventory_management/tree/main/docs/api
 *
 */

import {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react'
import PropTypes from 'prop-types'
import { fetchInventoryLists } from '../utils/simApi'
import { LOADING, DONE, ERROR } from '../utils/loadingStates'
import { useAppContext, useGamesContext } from '../hooks/contexts'
import useQuery from '../hooks/useQuery'
import paths from '../routing/paths'

const InventoryListsContext = createContext()

const InventoryListsProvider = ({ children, overrideValue = {} }) => {
  const queryString = useQuery()

  const { token, logOutAndRedirect, setFlashAttributes, setFlashVisible } = useAppContext()
  const { games } = useGamesContext()

  const activeGameId = useMemo(() => {
    if (games && games.length) {
      return parseInt(queryString.get('game_id') || games[0].id)
    } else {
      return null
    }
  }, [games, queryString])

  const [inventoryLists, setInventoryLists] = useState(overrideValue.inventoryLists || [])
  const [inventoryListLoadingState, setInventoryListLoadingState] = useState(LOADING)

  const inventoryListsOverridden = useRef(false)

  if (overrideValue.inventoryLists) {
    // Use this as the initial value only so that the inventory
    // lists can be updated when we interact in Storybook or other
    // tests
    delete overrideValue.inventoryLists
    inventoryListsOverridden.current = true
  }

  const mountedRef = useRef(true)

  const fetchLists = useCallback(() => {
    if (token && !inventoryListsOverridden.current) {
      fetchInventoryLists(token, activeGameId)
        .then(({ status, json }) => {
          if (status === 200) {
            if (mountedRef.current) {
              setInventoryLists(json)
              !overrideValue.inventoryListLoadingState && setInventoryListLoadingState(DONE)
            }
          } else {
            const message = json.errors ? `Error ${status} while fetching inventory lists: ${json.errors}` : `Unknown error ${status} while fetching inventory lists`
            throw new Error(message)
          }
        })
        .catch(err => {
          if (err.code === 401) {
            logOutAndRedirect(paths.login, () => mountedRef.current = false)
          } else if (err.code === 404 && mountedRef.current) {
            setFlashAttributes({
              type: 'error',
              message: "We couldn't find the game you're looking for."
            })

            setFlashVisible(true)

            !overrideValue.inventoryListLoadingState && setInventoryListLoadingState(ERROR)
          } else {
            if (process.env.NODE_ENV === 'development') console.error('Unexpected error fetching inventory lists: ', err)

            if (mountedRef.current) {
              !overrideValue.inventoryListLoadingState && setInventoryListLoadingState(ERROR)
            }
          }
        })
    }
  }, [token, overrideValue.inventoryListLoadingState, activeGameId])

  const value = {
    inventoryLists,
    inventoryListLoadingState,
    ...overrideValue
  }

  useEffect(() => {
    if (activeGameId && mountedRef.current) fetchLists()
  }, [fetchLists, activeGameId])

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <InventoryListsContext.Provider value={value}>
      {children}
    </InventoryListsContext.Provider>
  )
}

InventoryListsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  overrideValue: PropTypes.shape({
    inventoryLists: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      game_id: PropTypes.number,
      title: PropTypes.string.isRequired,
      aggregate: PropTypes.bool.isRequired,
      list_items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        list_id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        notes: PropTypes.string,
        unit_weight: PropTypes.number
      })).isRequired
    })),
    inventoryListLoadingState: PropTypes.oneOf([LOADING, DONE, ERROR])
  })
}

export { InventoryListsContext, InventoryListsProvider }
