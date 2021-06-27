import { backendBaseUri } from './config'

const baseUri = backendBaseUri[process.env.NODE_ENV]
const authHeader = token => ({ 'Authorization': `Bearer ${token}`})
const contentTypeHeader = { 'Content-Type': 'application/json' }
const combinedHeaders = token => ({ ...authHeader(token), ...contentTypeHeader })

export const authorize = token => {
  const uri = `${baseUri}/auth/verify_token`

  return(
    fetch(uri, {  headers: authHeader(token) })
  )
}
