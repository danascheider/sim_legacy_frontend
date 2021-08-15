import React, { useRef } from 'react'
import { PINK } from '../../utils/colorSchemes'
import { ColorProvider } from '../../contexts/colorContext'
import ListEditForm from './listEditForm'

const WrapperComponent = () => {
  const formRef = useRef(null)

  return(
    <div>
      <ListEditForm
        className='foo'
        formRef={formRef}
        maxTotalWidth={256}
        title='Severin Manor'
        onSubmit={e => e.preventDefault()}
      />
    </div>
  )
}

export default { title: 'ListEditForm' }

export const Default = () => (
  <ColorProvider colorScheme={PINK}>
    <WrapperComponent />
  </ColorProvider>
)
