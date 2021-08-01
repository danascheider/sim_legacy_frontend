import React from 'react'
import GamesDropdownOption from './gamesDropdownOption'

const Parent = ({ children }) => (
  <ul style={{ width: '228px', listStyleType: 'none', padding: 0, margin: 0 }}>
    {children}
  </ul>
)

export default { title: 'GamesDropdownOption' }

export const Default = () => (
  <Parent>
   <GamesDropdownOption
    name='My Game 1'
    key={1}
    ariaSelected={false}
  />
  </Parent>
)

export const LongName = () => (
  <Parent>
    <GamesDropdownOption
      name='Neque porro quisquam est quis dolorem ipsum quia dolor sit amet'
      key={2}
      ariaSelected={false}
    />
  </Parent>
)
