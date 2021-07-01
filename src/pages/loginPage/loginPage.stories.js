import React from 'react'
import { rest } from 'msw'
import { AppProvider } from '../../contexts/appContext'
import LoginPage from './loginPage'

const googleApiLink = 'https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.g8agzr_oroM.O/m=auth2/rt=j/sv=1/d=1/ed=1/am=AQ/rs=AGLTcCP6z3gW3iZ5SpDBmGgDQznnZEz5gQ/cb=gapi.loaded_0'
const googleApiJsLink = 'https://apis.google.com/js/api.js'

export default { title: 'LoginPage' }

export const Default = () => <AppProvider><LoginPage /></AppProvider>

Default.story = {
  parameters: {
    msw: [
      rest.get(googleApiLink, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({})
        )
      }),
      rest.get(googleApiJsLink, (req, res, ctx) => {
        return res(ctx.status(200))
      })
    ]
  }
}

export const SomethingWentWrong = () => <AppProvider><LoginPage /></AppProvider>

SomethingWentWrong.story = {
  parameters: {
    msw: [
      rest.get(googleApiLink, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            error: 'popup_closed_by_user',
            details: 'You closed the popup'
          })
        )
      }),
      rest.get(googleApiJsLink, (req, res, ctx) => {
        return res(
          ctx.status(500)
        )
      })
    ]
  }
}
