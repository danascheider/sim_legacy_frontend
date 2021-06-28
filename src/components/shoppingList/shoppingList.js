import React, { useState, useRef, useEffect } from 'react'
import useComponentVisible from '../../hooks/useComponentVisible'
import PropTypes from 'prop-types'
import { useColorScheme, useShoppingListContext } from '../../hooks/contexts'
import { ColorProvider } from '../../contexts/colorContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import SlideToggle from 'react-slide-toggle'
import ShoppingListForm from '../shoppingListForm/shoppingListForm'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import styles from './shoppingList.module.css'

const isValid = str => (
  // The title is valid if the entire string matches the regex. It can
  // contain alphanumeric characters, spaces, and leading or trailing
  // whitespace (which will be stripped before it is saved in the DB).
  // Any other characters (including non-space whitespace characters
  // that are not leading or trailing) will cause a validation error
  // on the backend.
  !!str && str.match(/^\s*[a-z0-9 ]*\s*$/i)[0] === str && str !== 'Master'
)

// TODO: This can get its list items from the context with just one extra step
//       of finding itself in the shoppingLists array and grabbing the list items
//       from there
const ShoppingList = ({ canEdit = true, listId, title}) => {
  const [toggleEvent, setToggleEvent] = useState(0)
  const [currentTitle, setCurrentTitle] = useState(title)
  const [listItems, setListItems] = useState(null)
  const [colorScheme] = useColorScheme()
  const slideTriggerRef = useRef(null)
  const { componentRef, triggerRef, isComponentVisible, setIsComponentVisible } = useComponentVisible()
  const { shoppingLists, performShoppingListUpdate } = useShoppingListContext()

  const originalTitle = title // to switch back in case of API error

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

  const slideTriggerRefContains = element => slideTriggerRef.current && (slideTriggerRef.current === element || slideTriggerRef.current.contains(element))
  const triggerRefContains = element => triggerRef.current && (triggerRef.current === element || triggerRef.current.contains(element))
  const componentRefContains = element => componentRef.current && (componentRef.current === element || componentRef.current.contains(element))
  const shouldToggleListItems = element => (slideTriggerRefContains(element) && !triggerRefContains(element)) && !componentRefContains(element)

  const toggleListItems = (e) => {
    if (shouldToggleListItems(e.target)) {
      setToggleEvent(Date.now)
    }
  }

  const styleVars = {
    '--scheme-color': schemeColor,
    '--border-color': borderColor,
    '--text-color': textColorPrimary,
    '--hover-color': hoverColor,
    '--scheme-color-lighter': schemeColorLighter,
    '--scheme-color-lightest': schemeColorLightest
  }

  const submitAndHideForm = e => {
    e.preventDefault()

    const newTitle = e.nativeEvent.target.children[0].defaultValue

    if (!newTitle || isValid(newTitle)) setCurrentTitle(newTitle)

    performShoppingListUpdate(listId, newTitle, null, () => { setCurrentTitle(originalTitle) })
    setIsComponentVisible(false)
  }

  useEffect(() => {
    if (shoppingLists === undefined) return // it'll run again when they populate

    const items = shoppingLists.find(obj => obj.id === listId).shopping_list_items
    setListItems(items)
  }, [shoppingLists])

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.titleContainer}>
        <div className={styles.trigger} ref={slideTriggerRef} onClick={toggleListItems}>
          {canEdit && <div ref={triggerRef}>
            <FontAwesomeIcon className={styles.fa} icon={faEdit} />
          </div>}
          {canEdit && isComponentVisible ?
            <ColorProvider colorScheme={colorScheme}>
              <ShoppingListForm
                formRef={componentRef}
                className={styles.form}
                title={title}
                onSubmit={submitAndHideForm}
              />
            </ColorProvider> :
            <h3 className={styles.title}>{currentTitle}</h3>}
        </div>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            {listItems && listItems.map(({ id, description, quantity, notes }) => {
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
  canEdit: PropTypes.bool,
  listId: PropTypes.number.isRequired
}

export default ShoppingList
