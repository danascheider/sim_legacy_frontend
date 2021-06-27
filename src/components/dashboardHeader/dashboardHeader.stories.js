import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { DashboardProvider } from '../../contexts/dashboardContext'
import DashboardHeader from './dashboardHeader'

export default { title: 'DashboardHeader' }

export const Default = () => <DashboardProvider><DashboardHeader /></DashboardProvider>

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
