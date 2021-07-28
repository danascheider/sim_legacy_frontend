import React from 'react'
import withModal from '../../hocs/withModal'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import Modal from '../../components/modal/modal'
import { token, profileData, emptyGames } from '../../sharedTestData'
import ModalGameCreateForm from './modalGameCreateForm'

export default { title: 'ModalGameCreateForm' }

export const Default = () => (
  <AppProvider overrideValue={{ profileData, token }}>
    <GamesProvider overrideValue={{ games: emptyGames }}>
      <Modal title='Create Game' setMobileVisible={() => {}}>
        <ModalGameCreateForm />
      </Modal>
    </GamesProvider>
  </AppProvider>
)
