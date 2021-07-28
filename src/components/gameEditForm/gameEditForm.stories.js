import React from 'react'
import { profileData, token, emptyGames } from '../../sharedTestData'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import Modal from '../../components/modal/modal'
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

export const Default = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games: emptyGames }}>
      <Modal title='Edit Game' setModalVisible={() => {}}>
        <GameEditForm gameId={12} currentAttributes={currentAttributesWithDescription} />
      </Modal>
    </GamesProvider>
  </AppProvider>
)

export const NoExistingDescription = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games: emptyGames }}>
      <Modal title='Edit Game' setModalVisible={() => {}}>
        <GameEditForm gameId={12} currentAttributes={currentAttributesWithoutDescription} />
      </Modal>
    </GamesProvider>
  </AppProvider>
)
