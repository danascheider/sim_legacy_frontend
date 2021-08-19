import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import colorSchemes from '../../utils/colorSchemes'
import styles from './modalForm.module.css'

const ModalForm = ({
  modelName,
  buttonLabel,
  onSubmit,
  fields,
  buttonColor = null,
}) => {
  const mountedRef = useRef(true)
  const formRef = useRef(null)
  const inputRef = useRef(null)

  // If the button color isn't specified in the props, pick
  // a random color
  const colorRef = useRef(buttonColor || colorSchemes[Math.floor(Math.random() * colorSchemes.length)])

  const colorVars = {
    '--button-background-color': colorRef.current.schemeColorDarkest,
    '--button-text-color': colorRef.current.textColorPrimary,
    '--button-hover-color': colorRef.current.hoverColorDark,
    '--button-border-color': colorRef.current.borderColor
  }

  useEffect(() => {
    inputRef.current && inputRef.current.focus()

    return () => mountedRef.current = false
  }, [])

  return(
    <form
      ref={formRef}
      className={styles.root}
      style={colorVars}
      onSubmit={onSubmit}
      data-testid={`${modelName}-form`}
    >
      {fields.map(({ tag: Tag, label, name, ...inputProps }, index) => {
        if (index === 0) inputProps['ref'] = inputRef

        return(
          <fieldset key={`${modelName}-${name}`} className={styles.fieldset}>
            <label className={styles.label} htmlFor={name}>{label}</label>
            <Tag
              className={styles.input}
              name={name}
              {...inputProps}
            />
          </fieldset>
        )
      })}
      <button className={styles.submit} type='submit'>{buttonLabel}</button>
    </form>
  )
}

ModalForm.propTypes = {
  // Should be a lower-cased string without whitespace. Used to set
  // the test ID of the form to something more specific.
  modelName: PropTypes.string.isRequired,
  // The text that should appear on the form's button
  buttonLabel: PropTypes.string.isRequired,
  // Submit handler for the form
  onSubmit: PropTypes.func.isRequired,
  // The color of the form's button, taken from /src/utils/colorSchemes.js.
  // Those color schemes automatically include these keys.
  buttonColor: PropTypes.shape({
    schemeColorDarkest: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    hoverColorDark: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired
  }),
  // A description of the form fields
  fields: PropTypes.arrayOf(PropTypes.shape({
    // It is recommended that the name of the form field be the same as the
    // name of the attribute it sets (all lower case)
    name: PropTypes.string.isRequired,
    // This form supports inputs and textareas. It's possible that in the
    // future it could be modified to support other form controls as well.
    tag: PropTypes.oneOf(['input', 'textarea']).isRequired,
    // The text of the label. Generally the name, titlecased.
    label: PropTypes.string.isRequired,
    // The type of the form control.
    type: PropTypes.oneOf(['text', 'number', 'textarea']).isRequired,
    // The placeholder value is required in case a value is `null`
    placeholder: PropTypes.string.isRequired,
    // Optional inputMode determines what keypad mobile users see. More
    // options could be added to this list but we didn't need them yet
    // so I just put these ones.
    inputMode: PropTypes.oneOf(['numeric', 'text', 'decimal']),
    // The starting `value` of the field, generally the current value of
    // the attribute, if there is one.
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired
}

export default ModalForm
