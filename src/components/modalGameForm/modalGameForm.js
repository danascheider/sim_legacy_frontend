import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAppContext, useGamesContext } from '../../hooks/contexts'
import ModalForm from '../modalForm/modalForm'

const formFields = [
  {
    name: 'name',
    tag: 'input',
    label: 'Name',
    type: 'text',
    placeholder: 'Name',
    inputMode: 'text'
  },
  {
    name: 'description',
    tag: 'input',
    label: 'Description',
    type: 'text',
    placeholder: 'Description',
    inputMode: 'text'
  }
]

const ModalGameForm = ({ type, currentAttributes = {} }) => {
  const { setFlashVisible, setModalVisible } = useAppContext()
  const { performGameCreate, performGameUpdate } = useGamesContext()

  const mountedRef = useRef(true)

  const onSubmit = e => {
    e.preventDefault()

    setFlashVisible(false)

    const unmountAndDisplayFlash = () => {
      setFlashVisible(true)
      setModalVisible(false)
      mountedRef.current = false
    }

    const callbacks = {
      onSuccess: unmountAndDisplayFlash,
      onUnprocessableEntity: unmountAndDisplayFlash,
      onInternalServerError: unmountAndDisplayFlash,
      onNotFound: unmountAndDisplayFlash, // only valid for update but won't break anything
      onUnauthorized: () => mountedRef.current = false
    }

    const attrs = {
      name: e.target.elements.name.value,
      description: e.target.elements.description.value
    }

    for (const attr in attrs) {
      if (attrs[attr] === currentAttributes[attr]) delete attrs[attr]
    }

    if (type === 'create') {
      performGameCreate(attrs, callbacks)
    } else {
      performGameUpdate(currentAttributes.id, attrs, callbacks)
    }
  }

  const fields = formFields.map(field => (
    currentAttributes[field.name] ? { defaultValue: currentAttributes[field.name], ...field } : field
  ))
  
  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <ModalForm
      modelName='game'
      buttonLabel={type === 'create' ? 'Create Game' : 'Update Game'}
      onSubmit={onSubmit}
      fields={fields}
    />
  )  
}

ModalGameForm.propTypes = {
  type: PropTypes.oneOf(['create', 'edit']).isRequired,
  currentAttributes: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  })
}

export default ModalGameForm
