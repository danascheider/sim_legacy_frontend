import { backendBaseUri } from './config'
import { AuthorizationError } from './customErrors'

const baseUri = backendBaseUri[process.env.NODE_ENV]
const authHeader = token => ({ 'Authorization': `Bearer ${token}`})
const contentTypeHeader = { 'Content-Type': 'application/json' }
const combinedHeaders = token => ({ ...authHeader(token), ...contentTypeHeader })

const throwAuthErrorOn401 = resp => {
  if (resp.status === 401) resp.json().then(data => { throw new AuthorizationError(data.error) })
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
