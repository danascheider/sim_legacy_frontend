import React from 'react'
import { profileData, token } from '../../sharedTestData'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import GameEditForm from './gameEditForm'

export default { title: 'GameEditForm' }

const currentAttributesWithDescription = {
  name: 'My Skyrim Game',
  description: "I don't know, something"
}

const currentAttributesWithoutDescription = {
  name: 'My Skyrim Game',
  description: null
}

const containerStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)'
}

export const Default = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games: [] }}>
      <div style={containerStyle}>
        <GameEditForm gameId={12} currentAttributes={currentAttributesWithDescription} />
      </div>
    </GamesProvider>
  </AppProvider>
)

export const NoExistingDescription = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games: [] }}>
      <div style={containerStyle}>
        <GameEditForm gameId={12} currentAttributes={currentAttributesWithoutDescription} />
      </div>
    </GamesProvider>
  </AppProvider>
)
