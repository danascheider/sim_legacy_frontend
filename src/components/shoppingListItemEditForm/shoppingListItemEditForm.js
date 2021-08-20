import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useAppContext, useShoppingListsContext } from '../../hooks/contexts'
import ModalForm from '../modalForm/modalForm'

const formFields = [
  {
    name: 'quantity',
    tag: 'input',
    label: 'Quantity',
    type: 'number',
    placeholder: 'Quantity',
    inputMode: 'numeric',
    min: 1,
    required: true
  },
  {
    name: 'unitWeight',
    tag: 'input',
    label: 'Unit Weight',
    type: 'number',
    placeholder: 'Unit Weight',
    inputMode: 'decimal',
    min: 0,
    step: 0.1
  },
  {
    name: 'notes',
    tag: 'textarea',
    label: 'Notes',
    type: 'textarea',
    placeholder: 'This item has no notes',
    inputMode: 'text'
  }
]

const ShoppingListItemEditForm = ({ buttonColor, currentAttributes }) => {
  const { setFlashVisible, setModalVisible } = useAppContext()
  const { performShoppingListItemUpdate } = useShoppingListsContext()

  const mountedRef = useRef(true)

  const fields = formFields.map(field => ({ defaultValue: currentAttributes[field.name], ...field }))

  const updateItem = e => {
    e.preventDefault()

    const callback = () => {
      setFlashVisible(true)
      setModalVisible(false)
      mountedRef.current = false
    }

    const callbacks = {
      onSuccess: callback,
      onNotFound: callback,
      onUnprocessableEntity: callback,
      onInternalServerError: callback,
      onUnauthorized: () => mountedRef.current = false
    }

    const quantity = e.target.elements.quantity.value
    const notes = e.target.elements.notes.value

    let unit_weight = e.target.elements.unitWeight.value
    if (unit_weight === undefined || unit_weight === null || unit_weight === '') {
      unit_weight = null
    } else {
      unit_weight = Number(unit_weight)
    }

    performShoppingListItemUpdate(currentAttributes.id, { quantity, unit_weight, notes }, callbacks)
  }

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <ModalForm
      modelName='shopping-list-item'
      buttonLabel='Update Item'
      buttonColor={buttonColor}
      onSubmit={updateItem}
      fields={fields}
    />
  )
}

ShoppingListItemEditForm.propTypes = {
  buttonColor: PropTypes.shape({
    schemeColorDarkest: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    hoverColorDark: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired
  }).isRequired,
  currentAttributes: PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    notes: PropTypes.string
  }).isRequired
}

export default ShoppingListItemEditForm
