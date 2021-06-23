import React from 'react'
import { rest } from 'msw'
import { worker } from '../../../.storybook/mocks/browser'
import DashboardHeader from './dashboardHeader'
import { backendBaseUri } from '../../utils/config'

export default { title: 'DashboardHeader' }

export const Default = () => <DashboardHeader />

Default.decorators = [
  (Story) => {
    worker.use(
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(ctx.json({
          id: 24,
          uid: 'jane.doe@gmail.com',
          email: 'jane.doe@gmail.com',
          name: 'Jane Doe',
          image_url: null,
        }))
      })
    )

    return <Story />
  }
]
