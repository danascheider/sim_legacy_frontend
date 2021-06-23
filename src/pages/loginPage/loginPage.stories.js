import React from 'react'
import { rest } from 'msw'
import { worker } from '../../../.storybook/mocks/browser'
import LoginPage from './loginPage'

const googleApiLink = 'https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.g8agzr_oroM.O/m=auth2/rt=j/sv=1/d=1/ed=1/am=AQ/rs=AGLTcCP6z3gW3iZ5SpDBmGgDQznnZEz5gQ/cb=gapi.loaded_0'

export default { title: 'LoginPage' }

export const Default = () => <LoginPage />
export const SomethingWentWrong = () => <LoginPage />

Default.decorators = [
  (Story) => {
    worker.use(
      rest.get(googleApiLink, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({})
        )
      })
    )

    return <Story />
  }
]

SomethingWentWrong.decorators = [
  (Story) => {
    worker.use(
      rest.get(googleApiLink, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({error: 'popup_closed_by_user'})
        )
      })
    )

    return <Story />
  }
]
