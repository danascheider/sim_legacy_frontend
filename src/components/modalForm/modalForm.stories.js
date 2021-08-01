import React from 'react'
import { AQUA } from '../../utils/colorSchemes'
import ModalForm from './modalForm'
import {
  fieldsWithCurrentValues,
  fieldsWithoutCurrentValues
} from './storyData'

export default { title: 'ModalForm' }

/*
 *
 * The modal form can start with default values for the fields
 * or not. This story also illustrates what happens when there
 * is no button color specified. The button should take on a
 * random color from the colorSchemes.
 *
 */

export const WithoutCurrentValues = () => (
  <ModalForm
    buttonLabel='Submit'
    modelName='widget'
    fields={fieldsWithoutCurrentValues}
    onSubmit={e => e.preventDefault()}
  />
)

/*
 *
 * This modal form has default values for two of the fields and a
 * current value of `null` for the third field, to illustrate what
 * happens if a `defaultValue` prop is passed in but the value is
 * `null`. This form also has a specified button color.
 *
 */

 export const WithCurrentValues = () => (
  <ModalForm
    buttonLabel='Submit'
    modelName='widget'
    fields={fieldsWithCurrentValues}
    onSubmit={e => e.preventDefault()}
    buttonColor={AQUA}
  />
)
