import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import SlideToggle from 'react-slide-toggle'
import ShoppingListForm from '../shoppingListForm/shoppingListForm'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import styles from './shoppingList.module.css'

const ShoppingList = ({ title, onSubmitEditForm, colorScheme, listItems = [] }) => {
  const {
    schemeColor,
    hoverColor,
    borderColor,
    textColorPrimary,
    schemeColorLighter,
    hoverColorLighter,
    schemeColorLightest,
    textColorSecondary,
    textColorTertiary,
  } = colorScheme

  const listItemColorScheme = {
    schemeColor: schemeColorLighter,
    hoverColor: hoverColorLighter,
    borderColor: borderColor,
    titleTextColor: textColorSecondary,
    bodyBackgroundColor: schemeColorLightest,
    bodyTextColor: textColorTertiary
  }

  const [toggleEvent, setToggleEvent] = useState(0)
  const [editFormVisible, setEditFormVisible] = useState(false)
  const buttonRef = useRef(null)
  const titleRef = useRef(null)

  const toggleListItems = (e) => {
    if (e.target === buttonRef.current || e.target === titleRef.current) {
      setToggleEvent(Date.now)
    }
  }

  const toggleEditForm = (e) => {
    e.stopPropagation();
    setEditFormVisible(!editFormVisible)
  }

  const styleVars = {
    '--scheme-color': schemeColor,
    '--border-color': borderColor,
    '--text-color': textColorPrimary,
    '--hover-color': hoverColor,
    '--scheme-color-lighter': schemeColorLighter,
    '--scheme-color-lightest': schemeColorLightest
  }

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.titleContainer}>
        <div className={styles.trigger} ref={buttonRef} onClick={toggleListItems}>
          {editFormVisible ?
            <ShoppingListForm
              className={styles.form}
              colorScheme={colorScheme}
              title={title}
              onSubmit={onSubmitEditForm}
            /> :
            <h3 className={styles.title} ref={titleRef}>{title}</h3>}
          <FontAwesomeIcon className={styles.fa} onClick={toggleEditForm} icon={faEdit} />
        </div>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            {listItems.map(({ id, description, quantity, notes }) => {
              const itemKey = `${title.toLowerCase().replace(' ', '-')}-${id}`

              return(
                <ShoppingListItem
                  key={itemKey}
                  description={description}
                  quantity={quantity}
                  notes={notes}
                  colorScheme={listItemColorScheme}
                />
              )
            })}
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

ShoppingList.propTypes = {
  title: PropTypes.string.isRequired,
  colorScheme: PropTypes.shape({
    schemeColor: PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    textColorPrimary: PropTypes.string.isRequired,
    schemeColorLighter: PropTypes.string.isRequired,
    hoverColorLighter: PropTypes.string.isRequired,
    schemeColorLightest: PropTypes.string.isRequired,
    textColorSecondary: PropTypes.string.isRequired,
    textColorTertiary: PropTypes.string.isRequired
  }).isRequired,
  onSubmitEditForm: PropTypes.func.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape).isRequired
}

export default ShoppingList
