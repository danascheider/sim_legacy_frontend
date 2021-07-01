export function AuthorizationError(message = '401 Unauthorized') {
  this.message = message
  this.code = 401
  this.name = 'AuthorizationError'
  this.stack = (new Error()).stack
}

AuthorizationError.prototype = new Error()

export function NotFoundError(message = '404 Not Found') {
  this.message = message
  this.code = 404
  this.name = 'NotFoundError'
  this.stack = (new Error()).stack
}

NotFoundError.prototype = new Error()

export function MethodNotAllowedError(message = '405 Method Not Allowed') {
  this.message = message
  this.code = 405
  this.name = 'MethodNotAllowedError'
  this.stack = (new Error()).stack
}

MethodNotAllowedError.prototype = new Error()
