import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useColorScheme } from '../../hooks/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import styles from './listEditForm.module.css'

const ListEditForm = ({ formRef, maxTotalWidth, className, title, onSubmit }) => {
  const getInputTextWidth = (text) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    context.font = '21px Quattrocento Sans'

    const max = (maxTextWidth || maxTotalWidth)
    
    // The 1.1 proved necessary to prevent text from scrolling out of the
    // view prematurely in Safari
    const textWidth = context.measureText(text).width * 1.1

    return Math.min(textWidth, max)
  }

  const [inputValue, setInputValue] = useState(title)
  const [maxTextWidth, setMaxTextWidth] = useState(null)
  const [inputWidth, setInputWidth] = useState(`${getInputTextWidth(title)}px`)

  const mountedRef = useRef(true)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  const { schemeColorDarkest, textColorPrimary, borderColor, schemeColorLightest } = useColorScheme()

  const colorVars = {
    '--scheme-color': schemeColorDarkest,
    '--text-color': textColorPrimary,
    '--border-color': borderColor,
    '--icon-hover-color': schemeColorLightest
  }

  const updateInputWidth = (e) => {
    if (!mountedRef.current) return

    const newValue = e.currentTarget.value
    setInputValue(newValue)
    setInputWidth(`${getInputTextWidth(newValue)}px`)
  }

  useEffect(() => {
    inputRef.current.focus()

    return () => mountedRef.current = false
  }, [])

  useEffect(() => {
    if (!mountedRef.current) return

    if (!buttonRef.current) return setMaxTextWidth(maxTotalWidth)

    setMaxTextWidth(maxTotalWidth - buttonRef.current.offsetWidth)
  }, [maxTotalWidth])

  return(
    <form className={classnames(className, styles.root)} style={colorVars} ref={formRef} onSubmit={onSubmit}>
      <input
        className={styles.input}
        onClick={e => e.stopPropagation()}
        onChange={updateInputWidth}
        type='text'
        name='title'
        aria-label='Title'
        ref={inputRef}
        style={{width: inputWidth}}
        value={inputValue}
        pattern="^\s*[A-Za-z0-9 \-',]*\s*$"
        title='Title can only contain alphanumeric characters, spaces, hyphens, commas, and apostrophes'
      />
      <button className={styles.submit} ref={buttonRef} name='submit' type='submit'>
        <FontAwesomeIcon className={styles.fa} icon={faCheckSquare} />
      </button>
    </form>
  )
}

ListEditForm.propTypes = {
  formRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  maxTotalWidth: PropTypes.number,
  className: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default ListEditForm
