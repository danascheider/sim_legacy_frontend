// When a regular shopping list is destroyed, all of its items are destroyed
// with it. This necessitates adjusting the aggregate list's items to
// reflect the new quantity or, if there are no matching items on other
// lists, remove the aggregate list item(s) whose quantity has been changed
// to 0. It also adjusts the value of the items' `notes` so any notes on
// the deleted item are removed from the corresponding aggregate list item.
export const removeOrAdjustItemsOnListDestroy = (aggregateList, items) => {
  const newAggregateListItems = []

  // Iterate through the array of items
  for (const item of items) {
    // Find the aggregate list item that corresponds to each item being
    // destroyed
    const existingAggregateListItem = aggregateList.list_items.find(listItem => 
      listItem.description.toLowerCase() === item.description.toLowerCase()
    )

    // This is where the actual adjustments happen - see comments on the
    // `removeOrAdjustItemOnItemDestroy` function for more information
    const aggregateListItem = removeOrAdjustItemOnItemDestroy(existingAggregateListItem, item)

    // If the aggregate list item still exists after the adjustment, add
    // it to the list
    if (aggregateListItem) newAggregateListItems.push(aggregateListItem)
  }

  aggregateList.list_items = newAggregateListItems

  // If the new length of the aggregate list is zero, that means all the
  // list items have been removed. Aggregate lists, like all lists, can
  // exist without list items, but in the event of list deletion (as
  // opposed to just removing all the items off the list), this means the
  // deleted list is the user's last regular list and the aggregate list
  // should also be destroyed.
  return newAggregateListItems.length === 0 ? null : aggregateList
}

// When a shopping list item is destroyed, the corresponding item also
// needs to be adjusted or destroyed on the aggregate list. This function
// takes an aggregate list item and the destroyed item as arguments (as
// JS objects with keys `quantity` and `notes`, of which `notes` can be
// `null`) and removes the quantity and notes of the deleted item from the
// aggregate list item. If the new quantity of the aggregate list item is
// zero, the object returned will be `null`.
export const removeOrAdjustItemOnItemDestroy = (aggregateListItem, destroyedItem) => {
  // If the quantity of the two items is equal, that means there is no
  // corresponding item on another list and the item should just be
  // removed from the aggregate list.
  if (aggregateListItem.quantity === destroyedItem.quantity) return null

  // There is no way, in real life, for the aggregate list quantity not to
  // be greater than or equal to the quantity of the same item on another
  // list for the same game. If it's greater, the quantity of the deleted
  // item should be subtracted from that of the aggregate list item.
  aggregateListItem.quantity -= destroyedItem.quantity

  // If there are notes on the destroyed item, the same notes will be
  // present on the aggregate list too, possibly concatenated with notes
  // from the corresponding item on other lists and separated from those by
  // `' --  '`. If the notes on the aggregate list consist only of the notes
  // on the regular list, that means that that was the only corresponding
  // item to have notes and the notes value of the aggregate list should be
  // set to `null`. If the aggregatelist item has other notes too, the notes
  // from the removed item will be removed and the notes cleaned up, where
  // "cleaned up" means that any excess spaces and/or dashes will be removed.
  if (destroyedItem.notes && aggregateListItem.notes === destroyedItem.notes) {
    aggregateListItem.notes = null
  } else if (destroyedItem.notes) {
    aggregateListItem.notes.replace(destroyedItem.notes, '').replace(/^ --/, '').replace(/ -- $/, '').replace(/( -- ){2,}/, ' -- ')
  }

  return aggregateListItem
}

// When a new list item is created on a regular list, there are two possible
// scenarios: one where an item with the same description is already on the
// list and the other where the item is totally new. If there is an existing
// item, the quantity and notes of the new item should be added to the
// existing one.
//
// This logic also holds when an item is added to an aggregate list - it will
// be combined with another item if there is one on that list and if not it
// will be added to the list.
export const combineListItems = (existingItem, newItem) => {
  // First add the quantity of the new item to that of the existing item
  existingItem.quantity += newItem.quantity

  // Combine the values of the notes on the existing and new items, if there
  // are notes on either of them.
  if (existingItem.notes) {
    existingItem.notes = newItem.notes ?
      existingItem.notes + ' -- ' + newItem.notes :
      existingItem.notes
  } else {
    existingItem.notes = newItem.notes
  }

  return existingItem
}

// When a new list item is created, it will need to be either added to the
// list or combined with an existing list item that matches its description.
// This function determines whether it should be added or combined and
// returns the new item (if it is entirely new) or the combined item if not.
export const addOrCombineListItem = (list, item) => {
  // Find the existing list item on the list given
  const existingItem = list.list_items.find(listItem => {
    return listItem.description.toLowerCase() === item.description.toLowerCase()
  })

  return existingItem ? combineListItems(existingItem, item) : item
}

// Sometimes we need to find out which shopping list a list item is on. This
// function goes through the list of lists and checks the `list_items` of
// each one, returning the list that contains the item.
export const findListByListItem = (lists, itemId) => {
  // Iterate through each list
  for (const list of lists) {
    // For each list, try to find the item with the matching ID on the list.
    const item = list.list_items.find(listItem => listItem.id === itemId)

    // If the item is found, return the list that it is on, otherewise move
    // on to the next iteration.
    if (item) return list
  }

  // If it gets to this point, that means that the item has not been found on
  // any of the lists passed in.
  return null
}

// Given a list of shopping lists and the ID of one of them, this function finds
// the aggregate list that corresponds to the list whose ID is passed in.
export const findAggregateList = (allLists, gameId) => (
  allLists.find(list => list.game_id === gameId && list.aggregate)
)

// When a list item is edited, the corresponding item must be updated on the
// aggregate list. This function takes the aggregate list item, the change in
// quantity that should be applied to it, the old notes value of the list item
// that was edited, and the new notes value of the same list item. The delta
// quantity argument can be any integer - positive, negative, or zero. Either
// or both of `oldNotes` and `newNotes` can be `null`.
export const adjustListItem = (listItem, deltaQuantity, oldNotes, newNotes) => {
  listItem.quantity = listItem.quantity + deltaQuantity

  // If the old notes and new notes both exist, the old value should be
  // replaced with the new one.
  if (oldNotes && newNotes && oldNotes !== newNotes) {
    listItem.notes.replace(oldNotes, newNotes)
  } else {
    // In any other case, including when either or both values are `null`, the
    // notes value of the aggregate list item should be set to the new value.
    listItem.notes = newNotes
  }

  return listItem
}
