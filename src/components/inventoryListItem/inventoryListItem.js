import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SlideToggle from 'react-slide-toggle'
import { useColorScheme } from '../../hooks/contexts'
import styles from './inventoryListItem.module.css'

// If the unit weight has an integer value, we want
// to display it as an integer. Only if it has a nonzero
// value in the decimal place should it be displayed as
// a decimal.
const formatWeight = weight => {
  if (weight === undefined || weight === null) return '-'

  const weightNum = Number(weight)

  return weightNum % 1 === 0 ? weightNum.toFixed(0) : weightNum.toFixed(1)
}

const InventoryListItem = ({
  canEdit = true,
  itemId,
  description,
  quantity,
  notes,
  unitWeight
}) => {
  const [toggleEvent, setToggleEvent] = useState(0)
  const [collapsed, setCollapsed] = useState(true)

  const {
    schemeColorDark,
    hoverColorLight,
    textColorSecondary,
    borderColor,
    schemeColorLightest,
    textColorTertiary
  } = useColorScheme()

  const toggleDetails = e => {
    setToggleEvent(Date.now)
    setCollapsed(!collapsed)
  }

  const styleVars = {
    '--scheme-color': schemeColorDark,
    '--title-text-color': textColorSecondary,
    '--border-color': borderColor,
    '--body-background-color': schemeColorLightest,
    '--body-text-color': textColorTertiary,
    '--hover-color': hoverColorLight
  }

  return(
    <div className={classNames(styles.root, { [styles.collapsed]: collapsed })} style={styleVars}>
      <div className={styles.toggle} onClick={toggleDetails}>
        <span className={styles.header}>
          <h3 className={styles.description}>{description}</h3>
        </span>
        <span className={styles.quantity}>
          <div className={styles.quantityContent}>{quantity}</div>
        </span>
      </div>
      <SlideToggle toggleEvent={toggleEvent} collapsed>
        {({ setCollapsibleElement }) => (
          <div className={styles.collapsible} ref={setCollapsibleElement}>
            <h4 className={styles.label}>Unit Weight:</h4>
            <p className={styles.value}>{formatWeight(unitWeight)}</p>

            <h4 className={styles.label}>Notes:</h4>
            <p className={styles.value}>{notes || 'No details available'}</p>
          </div>
        )}
      </SlideToggle>
    </div>
  )
}

InventoryListItem.propTypes = {
  canEdit: PropTypes.bool,
  itemId: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  listTitle: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  notes: PropTypes.string,
  unitWeight: PropTypes.number
}

export default InventoryListItem
