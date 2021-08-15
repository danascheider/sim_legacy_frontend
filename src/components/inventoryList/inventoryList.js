import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import titlecase from '../../utils/titlecase'
import { useColorScheme, useAppContext, useInventoryListsContext } from '../../hooks/contexts'
import useComponentVisible from '../../hooks/useComponentVisible'
import useSize from '../../hooks/useSize'
import ListEditForm from '../listEditForm/listEditForm'
import InventoryListItem from '../inventoryListItem/inventoryListItem'
import styles from './inventoryList.module.css'

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

const InventoryList = ({ canEdit = true, listId, title }) => {
  const { setFlashVisible } = useAppContext()
  const { inventoryLists, performInventoryListUpdate } = useInventoryListsContext()

  const [toggleEvent, setToggleEvent] = useState(0)
  const [currentTitle, setCurrentTitle] = useState(title)
  const [maxEditFormWidth, setMaxEditFormWidth] = useState(null)
  const [listItems, setListItems] = useState([])

  const mountedRef = useRef(true)
  const slideTriggerRef = useRef(null)
  const iconsRef = useRef(null)

  const size = useSize(slideTriggerRef)

  const { componentRef, triggerRef, isComponentVisible, setIsComponentVisible } = useComponentVisible()

  const slideTriggerRefContains = element => slideTriggerRef.current && (slideTriggerRef.current === element || slideTriggerRef.current.contains(element))
  const triggerRefContains = element => triggerRef.current && (triggerRef.current === element || triggerRef.current.contains(element))
  const componentRefContains = element => componentRef.current && (componentRef.current === element || componentRef.current.contains(element))
  const shouldToggleListItems = element => (slideTriggerRefContains(element) && !triggerRefContains(element) && !componentRefContains(element))

  const toggleListItems = e => {
    if (shouldToggleListItems(e.target)) setToggleEvent(Date.now)
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
    '--scheme-color-lightest': schemeColorLightest
  }

  const submitAndHideForm = e => {
    e.preventDefault()

    setFlashVisible(false)

    const newTitle = e.target.elements.title.value

    if (!newTitle || isValid(newTitle)) setCurrentTitle(titlecase(newTitle))

    const resetTitleDisplayErrorAndHideForm = () => {
      if (mountedRef.current) {
        setCurrentTitle(title)
        setFlashVisible(true)
        setIsComponentVisible(false)
      }
    }

    const callbacks = {
      onSuccess: () => mountedRef.current && setIsComponentVisible(false),
      onNotFound: resetTitleDisplayErrorAndHideForm,
      onUnprocessableEntity: resetTitleDisplayErrorAndHideForm,
      onInternalServerError: resetTitleDisplayErrorAndHideForm
    }

    performInventoryListUpdate(listId, newTitle, callbacks)
  }

  useEffect(() => {
    if (!inventoryLists || !mountedRef.current) return // it'll run again when they populate

    const items = inventoryLists.find(obj => obj.id === listId).list_items

    setListItems([...items])
  }, [inventoryLists, listId])

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
            <div className={styles.icon} ref={triggerRef} data-testid='edit-inventory-list'>
              <FontAwesomeIcon className={styles.fa} icon={faEdit} />
            </div>
          </span>}
          {canEdit && isComponentVisible ?
            <ListEditForm
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
            {listItems && listItems.length > 0 && listItems.map(({ id, description, quantity, notes, unit_weight }) => {
              const itemKey = `${title.toLowerCase().replace(' ', '-')}-${id}`

              return(
                <InventoryListItem
                  key={itemKey}
                  itemId={id}
                  listTitle={title}
                  description={description}
                  quantity={quantity}
                  notes={notes}
                  unitWeight={unit_weight}
                  canEdit={canEdit}
                />
              )
            })}
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

InventoryList.propTypes = {
  canEdit: PropTypes.bool,
  listId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
}

export default InventoryList
