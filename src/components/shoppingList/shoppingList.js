import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import SlideToggle from 'react-slide-toggle'
import titlecase from '../../utils/titlecase'
import useComponentVisible from '../../hooks/useComponentVisible'
import useSize from '../../hooks/useSize'
import { useAppContext, useColorScheme, useShoppingListsContext } from '../../hooks/contexts'
import ShoppingListEditForm from '../shoppingListEditForm/shoppingListEditForm'
import ShoppingListItem from '../shoppingListItem/shoppingListItem'
import styles from './shoppingList.module.css'
import ShoppingListItemCreateForm from '../shoppingListItemCreateForm/shoppingListItemCreateForm'

const isValid = str => (
  // The title is valid if the entire string matches the regex. It can
  // contain alphanumeric characters, spaces, and leading or trailing
  // whitespace (which will be stripped before it is saved in the DB).
  // Any other characters (including non-space whitespace characters
  // that are not leading or trailing) will cause a validation error
  // on the backend. The title of a regular list may also not be "All
  // Items".
  !!str && str.match(/^\s*[a-z0-9 ]*\s*$/i) && str.match(/^\s*[a-z0-9 ]*\s*$/i)[0] === str && str.toLowerCase() !== 'all items'
)

const ShoppingList = ({ canEdit = true, listId, title}) => {
  const DELETE_CONFIRMATION = `Are you sure you want to delete the list "${title}"? You will also lose any list items on the list. This action cannot be undone.`

  const [toggleEvent, setToggleEvent] = useState(0)
  const [currentTitle, setCurrentTitle] = useState(title)
  const [maxEditFormWidth, setMaxEditFormWidth] = useState(null)
  const [listItems, setListItems] = useState([])

  const mountedRef = useRef(true)
  const slideTriggerRef = useRef(null)
  const deleteTriggerRef = useRef(null)
  const iconsRef = useRef(null)

  const size = useSize(slideTriggerRef)

  const { componentRef, triggerRef, isComponentVisible, setIsComponentVisible } = useComponentVisible()

  const { setFlashAttributes, setFlashVisible } = useAppContext()

  const {
    shoppingLists,
    performShoppingListUpdate,
    performShoppingListDestroy,
  } = useShoppingListsContext()

  const originalTitle = title // to switch back in case of API error on update

  const slideTriggerRefContains = element => slideTriggerRef.current && (slideTriggerRef.current === element || slideTriggerRef.current.contains(element))
  const triggerRefContains = element => triggerRef.current && (triggerRef.current === element || triggerRef.current.contains(element))
  const deleteTriggerRefContains = element => deleteTriggerRef.current && (deleteTriggerRef.current === element || deleteTriggerRef.current.contains(element))
  const componentRefContains = element => componentRef.current && (componentRef.current === element || componentRef.current.contains(element))
  const shouldToggleListItems = element => (slideTriggerRefContains(element) && !triggerRefContains(element)) && !componentRefContains(element) && !deleteTriggerRefContains(element)

  const toggleListItems = e => {
    if (shouldToggleListItems(e.target)) {
      setToggleEvent(Date.now)
    }
  }

  const {
    schemeColorDarkest,
    borderColor,
    textColorPrimary,
    textColorSecondary,
    hoverColorDark,
    schemeColorDark,
    schemeColorLightest
  } = useColorScheme()

  const styleVars = {
    '--scheme-color': schemeColorDarkest,
    '--border-color': borderColor,
    '--text-color-primary': textColorPrimary,
    '--text-color-secondary': textColorSecondary,
    '--hover-color': hoverColorDark,
    '--scheme-color-lighter': schemeColorDark,
    '--scheme-color-lightest': schemeColorLightest,
    '--max-title-width': `${maxEditFormWidth - 32}px`
  }

  const submitAndHideForm = e => {
    e.preventDefault()

    setFlashVisible(false)

    const newTitle = e.nativeEvent.target.children[0].defaultValue

    if (!newTitle || isValid(newTitle)) setCurrentTitle(titlecase(newTitle))

    const resetTitleAndDisplayError = () => {
      setCurrentTitle(originalTitle)
      setFlashVisible(true)
    }

    const callbacks = {
      onNotFound: resetTitleAndDisplayError,
      onUnprocessableEntity: resetTitleAndDisplayError,
      onInternalServerError: resetTitleAndDisplayError
    }

    performShoppingListUpdate(listId, newTitle, callbacks)
    setIsComponentVisible(false)
  }

  const deleteList = e => {
    const confirmed = window.confirm(DELETE_CONFIRMATION)

    setFlashVisible(false)

    if (confirmed) {
      const onSuccess = () => {
        setFlashVisible(true)
        mountedRef.current = false
      }

      const onError = () => setFlashVisible(true)

      performShoppingListDestroy(listId, { onSuccess, onNotFound: onError, onInternalServerError: onError })
    } else if (mountedRef.current) {
      setFlashAttributes({
        type: 'info',
        message: 'Your list was not deleted.'
      })

      setFlashVisible(true)
    }
  }

  useEffect(() => {
    if (!shoppingLists || !mountedRef.current) return // it'll run again when they populate

    const items = shoppingLists.find(obj => obj.id === listId).list_items

    setListItems([...items])
  }, [shoppingLists, listId])

  useEffect(() => {
    if (!size || !iconsRef.current || !mountedRef.current) return

    setMaxEditFormWidth(size.width - iconsRef.current.offsetWidth - 16)
  }, [size])

  useEffect(() => (
    () => mountedRef.current = false
  ), [])

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.titleContainer}>
        <div className={styles.trigger} ref={slideTriggerRef} onClick={toggleListItems}>
          {canEdit &&
          <span className={styles.editIcons} ref={iconsRef}>
            <div className={styles.icon} ref={deleteTriggerRef} onClick={deleteList} data-testid='delete-shopping-list'>
              <FontAwesomeIcon className={styles.fa} icon={faTimes} />
            </div>
            <div className={styles.icon} ref={triggerRef} data-testid='edit-shopping-list'>
              <FontAwesomeIcon className={styles.fa} icon={faEdit} />
            </div>
          </span>}
          {canEdit && isComponentVisible ?
            <ShoppingListEditForm
              formRef={componentRef}
              maxTotalWidth={maxEditFormWidth}
              className={styles.form}
              title={title}
              onSubmit={submitAndHideForm}
            /> :
            <h3 className={styles.title}>{currentTitle}</h3>}
        </div>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            {!canEdit && listItems.length === 0 && <div className={styles.emptyList}>You have no shopping list items.</div>}
            {canEdit && <ShoppingListItemCreateForm listId={listId} />}
            {listItems && listItems.length > 0 && listItems.map(({ id, description, quantity, notes }) => {
              const itemKey = `${title.toLowerCase().replace(' ', '-')}-${id}`

              return(
                <ShoppingListItem
                  key={itemKey}
                  itemId={id}
                  listTitle={title}
                  canEdit={canEdit}
                  description={description}
                  quantity={quantity}
                  notes={notes}
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
