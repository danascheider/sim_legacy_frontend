const AuthorizationError = (message = '401 Unauthorized') => {
  let instance = new Error(message)
  instance.name = 'AuthorizationError'
  instance.message = message
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this))
  return instance
}

AuthorizationError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(AuthorizationError, Error)
} else {
  AuthorizationError.__proto__ = Error
}

export { AuthorizationError }
