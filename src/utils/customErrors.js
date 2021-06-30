export function AuthorizationError(message = '401 Unauthorized') {
  this.message = message
  this.code = 401
  this.name = 'AuthorizationError'
  this.stack = (new Error()).stack
}

AuthorizationError.prototype = new Error()
