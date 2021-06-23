import React from 'react'
import { rest } from 'msw'
import { worker } from '../../../.storybook/mocks/browser'
import { backendBaseUri } from '../../utils/config'
import DashboardPage from './dashboardPage'

export default { title: 'DashboardPage' }

export const Default = () => <DashboardPage />

Default.decorators = [
  (Story) => {
    worker.use(
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(ctx.json({
          id: 24,
          uid: 'jane.doe@gmail.com',
          email: 'jane.doe@gmail.com',
          name: 'Jane Doe',
          image_url: null
        }))
      })
    )

    return <Story />
  }
]
