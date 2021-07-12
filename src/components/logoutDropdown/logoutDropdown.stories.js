import React from 'react'
import LogoutDropdown from './logoutDropdown'

const noop = () => {}

export default { title: 'LogoutDropdown' }

export const Default = () => <LogoutDropdown logOutFunction={noop} />
