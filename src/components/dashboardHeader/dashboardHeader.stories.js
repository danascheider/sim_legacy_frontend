import React from 'react'
import DashboardHeader from './dashboardHeader'
import anonymousAvatar from './anonymousAvatar.jpg'

const userData = {
  email: 'foo@gmail.com',
  name: 'Jane Doe',
  image_url: anonymousAvatar // snake case because this comes from the server :(
}

export default { title: 'DashboardHeader' }

export const Default = () => <DashboardHeader data={userData} onClick={() => {}} />
