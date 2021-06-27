export const AuthorizationError = (message = '401 Unauthorized') => {
  let instance = new Error(message)
  instance.name = 'AuthorizationError'
  instance.message = message
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this))
  return instance
}
