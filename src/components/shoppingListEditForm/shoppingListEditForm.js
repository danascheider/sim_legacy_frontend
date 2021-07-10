import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useColorScheme } from '../../hooks/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import styles from './shoppingListEditForm.module.css'

const ShoppingListEditForm = ({ formRef, maxTotalWidth, className, title, onSubmit }) => {
  const getInputTextWidth = (text) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = '21px Quattrocento Sans'

    const max = (maxTextWidth || maxTotalWidth)

    return Math.min(context.measureText(text).width, max)
  }

  const [inputValue, setInputValue] = useState(title)
  const [maxTextWidth, setMaxTextWidth] = useState(null)
  const [inputWidth, setInputWidth] = useState(`${getInputTextWidth(title)}px`)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  const { schemeColor, textColorPrimary, borderColor, schemeColorLightest } = useColorScheme()

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

  useEffect(() => {
    if (!buttonRef.current) return setMaxTextWidth(maxTotalWidth)

    // 14px of left/right padding in the input
    setMaxTextWidth(maxTotalWidth - buttonRef.current.offsetWidth - 14)
  }, [maxTotalWidth, buttonRef.current])

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
      <button className={styles.submit} ref={buttonRef} name='submit' type='submit'>
        <FontAwesomeIcon className={styles.fa} icon={faCheckSquare} />
      </button>
    </form>
  )
}

ShoppingListEditForm.propTypes = {
  formRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  maxTotalWidth: PropTypes.number,
  className: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default ShoppingListEditForm
