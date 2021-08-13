import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import SlideToggle from 'react-slide-toggle'
import titlecase from '../../utils/titlecase'
import useComponentVisible from '../../hooks/useComponentVisible'
import { useColorScheme, useInventoryListsContext } from '../../hooks/contexts'
import InventoryListItem from '../inventoryListItem/inventoryListItem'
import styles from './inventoryList.module.css'

const InventoryList = ({ canEdit = true, listId, title }) => {
  const { inventoryLists } = useInventoryListsContext()

  const [toggleEvent, setToggleEvent] = useState(0)
  const [listItems, setListItems] = useState([])

  const slideTriggerRef = useRef(null)

  const slideTriggerRefContains = element => slideTriggerRef.current && (slideTriggerRef.current === element || slideTriggerRef.current.contains(element))

  const toggleListItems = e => {
    if (slideTriggerRefContains(e.target)) setToggleEvent(Date.now)
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

  useEffect(() => {
    if (!inventoryLists) return // it'll run again when they populate

    const items = inventoryLists.find(obj => obj.id === listId).list_items

    setListItems([...items])
  }, [inventoryLists, listId])

  return(
    <div className={styles.root} style={styleVars}>
      <div className={styles.titleContainer}>
        <div className={styles.trigger} ref={slideTriggerRef} onClick={toggleListItems}>
          <h3 className={styles.title}>{title}</h3>
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
