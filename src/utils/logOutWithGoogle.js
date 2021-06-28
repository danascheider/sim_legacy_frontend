const defaultErrorCallback = err => {
  console.error('Error signing out: ', err.message)
}

const logOutWithGoogle = (success = () => {}, error = defaultErrorCallback) => {
  if (window.gapi && window.gapi.auth2) {
    const GoogleAuth = window.gapi.auth2.getAuthInstance()

    if (GoogleAuth !== null) {
      GoogleAuth
        .then(() => GoogleAuth.signOut())
        .then(success, error)
    }
  } else {
    // Google thinks they aren't logged in anyway
    success()
  }
}

export default logOutWithGoogle
