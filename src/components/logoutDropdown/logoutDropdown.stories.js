import React from 'react'
import LogoutDropdown from './logoutDropdown'

const noop = () => {}

export default { title: 'LogoutDropdown' }

export const Default = () => <LogoutDropdown successCallback={noop} failureCallback={noop} />
