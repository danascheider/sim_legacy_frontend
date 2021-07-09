export const googleClientId = process.env.NODE_ENV === 'production' ?
  '891031345873-gf3loovttd7bfvrq4ilqdduvvibb0tub.apps.googleusercontent.com' :
  '891031345873-ir73kc1ru0ncv564iesac94kjaap5nf4.apps.googleusercontent.com'

export const backendBaseUri = process.env.NODE_ENV === 'production' ? 'https://sim-api.danascheider.com' : 'http://localhost:3000'

export const frontendBaseUri = process.env.NODE_ENV === 'production' ? 'https://sim.danascheider.com' : 'http://localhost:3001'

export const sessionCookieName = '_sim_google_session'
