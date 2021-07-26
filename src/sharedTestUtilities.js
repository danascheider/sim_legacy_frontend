export const removeOrAdjustItemsOnListDestroy = (aggregateList, items) => {
  const newAggregateListItems = []

  for (const item of items) {
    const existingAggregateListItem = aggregateList.list_items.find(listItem => listItem.description.toLowerCase() === item.description.toLowerCase())
    const aggregateListItem = removeOrAdjustItemOnItemDestroy(existingAggregateListItem, item)

    if (!aggregateListItem) continue // it should be removed from the array

    newAggregateListItems.push(aggregateListItem)
  }

  aggregateList.list_items = newAggregateListItems
  return newAggregateListItems.length === 0 ? null : aggregateList
}

export const removeOrAdjustItemOnItemDestroy = (aggregateListItem, destroyedItem) => {
  if (aggregateListItem.quantity === destroyedItem.quantity) return null

  aggregateListItem.quantity -= destroyedItem.quantity
  if (aggregateListItem.notes) aggregateListItem.notes.replace(destroyedItem.notes, '').replace(/^ --/, '').replace(/ -- $/, '')

  return aggregateListItem
}

const combineListItems = (existingItem, newItem) => {
  existingItem.quantity += newItem.quantity
  existingItem.description = newItem.description ?
    existingItem.description + ' -- ' + newItem.description :
    existingItem.description

  return existingItem
}

export const addOrCombineListItem = (list, item) => {
  const existingItem = list.list_items.find(listItem => listItem.description === item.description)
  
  if (!existingItem) return item

  return combineListItems(existingItem, item)
}

export const findListByListItem = (lists, itemId) => {
  for (const list of lists) {
    const item = list.list_items.find(listItem => listItem.id === itemId)
    if (item) return list
  }

  return null
}

export const adjustAggregateListItem = (aggregateListItem, deltaQuantity, oldNotes, newNotes) => {
  aggregateListItem.quantity = aggregateListItem.quantity + deltaQuantity

  if (oldNotes !== newNotes) {
    if (aggregateListItem.notes) {
      aggregateListItem.notes.replace(oldNotes, newNotes)
    } else {
      aggregateListItem.notes = newNotes
    }
  }

  return aggregateListItem
}

export const findAggregateList = (allLists, listId) => {
  const gameId = allLists.find(list => list.id === listId).game_id

  return allLists.find(list => list.game_id === gameId && list.aggregate)
}

export const adjustListItem = (listItem, deltaQuantity, oldNotes, newNotes) => {
  listItem.quantity = listItem.quantity + deltaQuantity

  // TODO: This is not how the back end handles notes
  if (oldNotes !== newNotes) {
    if (listItem.notes) {
      listItem.notes.replace(oldNotes, newNotes)
    } else {
      listItem.notes = newNotes
    }
  }

  return listItem
}
