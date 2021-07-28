import React from 'react'
import Modal from '../../components/modal/modal'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { token, profileData, games } from '../../sharedTestData'
import ModalForm from './modalGameForm'

export default { title: 'ModalGameForm' }

export const CreateForm = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <Modal title='Create Game' setModalVisible={() => {}}>
        <ModalForm type='create' onSubmit={e => e.preventDefault()} />
      </Modal>
    </GamesProvider>
  </AppProvider>
)

const gameAttributes = {
  id: 12,
  user_id: 24,
  name: 'Game 1',
  description: 'This game has a description'
}

export const UpdateFormWithDescription = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <Modal title='Edit Game' setModalVisible={() => {}}>
        <ModalForm type='edit' onSubmit={e => e.preventDefault()} currentAttributes={gameAttributes} />
      </Modal>
    </GamesProvider>
  </AppProvider>
)

const gameAttributesNoDesc = {
  ...gameAttributes,
  description: null
}

export const UpdateFormNoDescription = () => (
  <AppProvider overrideValue={{ token, profileData }}>
    <GamesProvider overrideValue={{ games }}>
      <Modal title='Edit Game' setModalVisible={() => {}}>
        <ModalForm type='edit' onSubmit={e => e.preventDefault()} currentAttributes={gameAttributesNoDesc} />
      </Modal>
    </GamesProvider>
  </AppProvider>
)
