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
      data-testid={`${modelName.toLowerCase()}-form`}
    >
      {fields.map(({ tag: Tag, label, name, ...inputProps }, index) => {
        if (index === 0) inputProps['ref'] = inputRef

        return(
          <fieldset className={styles.fieldset}>
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
  modelName: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonColor: PropTypes.shape({
    schemeColorDarkest: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    hoverColorDark: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired
  }),
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'number', 'textarea']).isRequired,
    placeholder: PropTypes.string.isRequired,
    inputMode: PropTypes.oneOf(['numeric', 'text']),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }))
}

export default ModalForm
