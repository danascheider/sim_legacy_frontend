import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import useColorScheme from '../../hooks/useColorScheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import styles from './shoppingListForm.module.css'

const ShoppingListForm = ({ formRef, className, title, onSubmit }) => {
  const getInputTextWidth = (text) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = '21px Quattrocento Sans'

    return context.measureText(text).width
  }

  const [inputValue, setInputValue] = useState(title)
  const [inputWidth, setInputWidth] = useState(`${getInputTextWidth(title)}px`)
  const inputRef = useRef(null)

  const [ colorScheme ] = useColorScheme()

  const { schemeColor, textColorPrimary, borderColor, schemeColorLightest } = colorScheme

  const colorVars = {
    '--scheme-color': schemeColor,
    '--text-color': textColorPrimary,
    '--border-color': borderColor,
    '--icon-hover-color': schemeColorLightest
  }

  const updateInputWidth = (e) => {
    const newValue = e.currentTarget.value
    setInputValue(newValue)
    setInputWidth(`${getInputTextWidth(newValue)}px`)
  }

  useEffect(() => {
    inputRef.current.focus()
  })

  return(
    <form className={classnames(className, styles.root)} style={colorVars} ref={formRef} onSubmit={onSubmit}>
      <input
        className={styles.input}
        onClick={e => e.stopPropagation()}
        onChange={updateInputWidth}
        type='text'
        name='title'
        ref={inputRef}
        style={{width: inputWidth}}
        value={inputValue}
      />
      <button className={styles.submit} name='submit' type='submit'>
        <FontAwesomeIcon className={styles.fa} icon={faCheckSquare} />
      </button>
    </form>
  )
}

ShoppingListForm.propTypes = {
  formRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  className: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default ShoppingListForm
