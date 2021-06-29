/*
 *
 * This module is an abstraction layer for the SIM API that handles making requests
 * to the API. These functions handle three things: (1) formulating the requests based
 * on which function it is and the args being passed in (including assembling both
 * headers and request body) and (2) throwing an authError object if the request fails.
 * The authError object, as you can see below, has the name 'Authorization Error', the
 * code 401, and a message that can be passed in and otherwise defaults to '401 Unauthorized'.
 * 
 * For more information on the SIM API, its endpoints, the requests it expects, or its
 * responses, please visit the backend API docs:
 * https://github.com/danascheider/skyrim_inventory_management/tree/main/docs/api
 * 
 */

import { backendBaseUri } from './config'

const authError = (msg = '401 Unauthorized') => ({ name: 'AuthorizationError', code: 401, message: msg })
const baseUri = backendBaseUri[process.env.NODE_ENV]
const authHeader = token => ({ 'Authorization': `Bearer ${token}`})
const contentTypeHeader = { 'Content-Type': 'application/json' }
const combinedHeaders = token => ({ ...authHeader(token), ...contentTypeHeader })

const throwAuthErrorOn401 = resp => {
  if (resp.status === 401) resp.json().then(data => { throw authError(data.error) })
}

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
        throwAuthErrorOn401(resp)
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
        throwAuthErrorOn401(resp)
        return resp
      })
  )
}

/*
 *
 * Shopping List Endpoints (Scoped to Authenticated User)
 *
 */

// GET index
export const fetchShoppingLists = token => {
  const uri = `${baseUri}/shopping_lists`

  return(
    fetch(uri, { headers: authHeader(token) })
      .then(resp => {
        throwAuthErrorOn401(resp)
        return resp
      })
  )
}

// POST create
export const createShoppingList = (token, attrs) => {
  const uri = `${baseUri}/shopping_lists`
  const body = JSON.stringify({ shopping_list: attrs })

  return fetch(uri, {
    method: 'POST',
    headers: combinedHeaders(token),
    body: body
  })
  .then(resp => {
    throwAuthErrorOn401(resp)
    return resp
  })
}

// PATCH update
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
      throwAuthErrorOn401(resp)
      return resp
    })
  )
}
