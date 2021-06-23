import React from 'react'
import { rest } from 'msw'
import DashboardHeader from './dashboardHeader'
import { backendBaseUri } from '../../utils/config'

export default { title: 'DashboardHeader' }

export const Default = () => <DashboardHeader />

Default.story = {
  parameters: {
    msw: [
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) => {
        return res(ctx.json({
          id: 24,
          uid: 'jane.doe@gmail.com',
          email: 'jane.doe@gmail.com',
          name: 'Jane Doe',
          image_url: null
        }))
      })
    ]
  }
}
