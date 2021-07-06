/*
 *
 * This module is an abstraction layer for the SIM API that handles making requests
 * to the API. These functions handle three things: (1) formulating the requests based
 * on which function it is and the args being passed in (including assembling both
 * headers and request body) and (2) throwing an AuthorizationError if the request fails.
 * The AuthorizationError has name 'AuthorizationError', code 401, and either the
 * message passed to the constructor or, by default, '401 Unauthorized'.
 * 
 * For more information on the SIM API, its endpoints, the requests it expects, or its
 * responses, please visit the backend API docs:
 * https://github.com/danascheider/skyrim_inventory_management/tree/main/docs/api
 * 
 */

import { backendBaseUri } from './config'
import {
  AuthorizationError,
  MethodNotAllowedError,
  NotFoundError
} from './customErrors'

const baseUri = backendBaseUri[process.env.NODE_ENV]
const contentTypeHeader = { 'Content-Type': 'application/json' }
const authHeader = token => ({ 'Authorization': `Bearer ${token}`})
const combinedHeaders = token => ({ ...authHeader(token), ...contentTypeHeader })

/*
 *
 * Google OAuth Token Verification Endpoint
 * 
 */

export const authorize = token => {
  const uri = `${baseUri}/auth/verify_token`

  return(
    fetch(uri, {  headers: authHeader(token) })
      .then(resp => {
        if (resp.status === 401) throw new AuthorizationError()
        return resp
      })
  )
}

/*
 *
 * User Profile Endpoint
 * 
 */

export const fetchUserProfile = token => {
  const uri = `${baseUri}/users/current`

  return(
    fetch(uri, { headers: authHeader(token) })
      .then(resp => {
        if (resp.status === 401) throw new AuthorizationError()
        return resp
      })
  )
}

/*
 *
 * Shopping List Endpoints (Scoped to Authenticated User)
 *
 */

// GET /shopping_lists
export const fetchShoppingLists = token => {
  const uri = `${baseUri}/shopping_lists`

  return(
    fetch(uri, { headers: authHeader(token) })
      .then(resp => {
        if (resp.status === 401) throw new AuthorizationError()
        return resp
      })
  )
}

// POST /shopping_lists
export const createShoppingList = (token, attrs) => {
  const uri = `${baseUri}/shopping_lists`
  const body = JSON.stringify({ shopping_list: attrs })

  return fetch(uri, {
    method: 'POST',
    headers: combinedHeaders(token),
    body: body
  })
  .then(resp => {
    if (resp.status === 401) throw new AuthorizationError()
    return resp
  })
}

// PATCH /shopping_lists/:id
export const updateShoppingList = (token, listId, attrs) => {
  const uri = `${baseUri}/shopping_lists/${listId}`

  const body = JSON.stringify({
    id: listId,
    shopping_list: attrs
  })

  return(
    fetch(uri, {
      method: 'PATCH',
      headers: combinedHeaders(token),
      body: body
    })
    .then(resp => {
      // It might return a 422 error too, but in that case we'll need the response
      // JSON to handle the error
      if (resp.status === 401) throw new AuthorizationError()
      if (resp.status === 404) throw new NotFoundError('Shopping list not found. Try refreshing the page to resolve this issue.')
      if (resp.status === 405) throw new MethodNotAllowedError('Master lists are managed automatically and cannot be updated manually.')
      return resp
    })
  )
}

// DELETE /shopping_lists/:id
export const deleteShoppingList = (token, listId) => {
  const uri = `${baseUri}/shopping_lists/${listId}`

  return(
    fetch(uri, {
      method: 'DELETE',
      headers: authHeader(token),
    })
    .then(resp => {
      if (resp.status === 401) throw new AuthorizationError()
      if (resp.status === 404) throw new NotFoundError('Shopping list not found. Try refreshing the page to resolve this issue.')
      if (resp.status === 405) throw new MethodNotAllowedError('Master lists are managed automatically and cannot be deleted manually.')
      return resp
    })
  )
}
