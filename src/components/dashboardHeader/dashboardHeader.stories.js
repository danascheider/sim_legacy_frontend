import React from 'react'
import { rest } from 'msw'
import { worker } from '../../../.storybook/mocks/browser'
import DashboardHeader from './dashboardHeader'
import anonymousAvatar from './anonymousAvatar.jpg'
import { backendBaseUri } from '../../utils/config'

const userData = {
  email: 'foo@gmail.com',
  name: 'Jane Doe',
  image_url: anonymousAvatar // snake case because this comes from the server :(
}

export default { title: 'DashboardHeader' }

export const Default = () => <DashboardHeader data={userData} onClick={() => {}} />

Default.decorators = [
  (Story) => {
    worker.use(
      rest.get(`${backendBaseUri[process.env.NODE_ENV]}/users/current`, (req, res, ctx) =>   {
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
