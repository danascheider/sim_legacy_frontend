import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import styles from './shoppingListForm.module.css'

const ShoppingListForm = ({ className, colorScheme, title, onSubmit }) => {
  const getInputTextWidth = (text) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = '21px Quattrocento Sans'

    return context.measureText(text).width
  }

  const [inputValue, setInputValue] = useState(title)
  const [inputWidth, setInputWidth] = useState(`${getInputTextWidth(title)}px`)

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
  // TODO: Shift focus to form when it appears

  return(
    <form className={classnames(className, styles.root)} style={colorVars} onSubmit={onSubmit}>
      <input
        className={styles.input}
        onClick={e => e.stopPropagation()}
        onChange={updateInputWidth}
        type='text'
        name='title'
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
  className: PropTypes.string.isRequired,
  colorScheme: PropTypes.shape({
    schemeColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    schemeColorLightest: PropTypes.string.isRequired,
    hoverColor: PropTypes.string,
    schemeColorLighter: PropTypes.string,
    hoverColorLighter: PropTypes.string,
    textColorSecondary: PropTypes.string,
    textColorTertiary: PropTypes.string
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default ShoppingListForm
