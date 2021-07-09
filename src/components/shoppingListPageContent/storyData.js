export const profileData = {
  id: 24,
  name: 'Jane Doe',
  email: 'jane.doe@gmail.com',
  uid: 'jane.doe@gmail.com',
  image_url: null
}

export const emptyShoppingLists = []

export const shoppingLists = [
  {
    id: 1,
    user_id: 24,
    master: true,
    title: 'Master',
    list_items: [
      {
        id: 2,
        list_id: 1,
        description: 'Ebony sword',
        quantity: 2,
        notes: 'notes 1 -- notes 2'
      },
      {
        id: 5,
        list_id: 1,
        description: 'Ingredients with "Frenzy" property',
        quantity: 4,
        notes: null
      },
      {
        id: 6,
        list_id: 1,
        description: "Item there's only one of on the master list",
        quantity: 1,
        notes: 'notes1'
      }
    ]
  },
  {
    id: 2,
    user_id: 24,
    master: false,
    title: 'Heljarchen Hall',
    list_items: [
      {
        id: 1,
        list_id: 2,
        description: 'Ebony sword',
        quantity: 1,
        notes: 'notes 1'
      },
      {
        id: 3,
        list_id: 2,
        description: 'Ingredients with "Frenzy" property',
        quantity: 4,
        notes: null
      },
      {
        id: 4,
        list_id: 2,
        description: "Item there's only one of on the master list",
        quantity: 1,
        notes: 'notes1'
      }
    ]
  },
  {
    id: 3,
    user_id: 24,
    master: false,
    title: 'Lakeview Manor',
    list_items: [
      {
        id: 5,
        list_id: 3,
        description: 'Ebony sword',
        quantity: 1,
        notes: 'notes 2'
      }
    ]
  }
]

export const shoppingListUpdateData = {
  user_id: 24,
  master: false,
  list_items: [
    {
      id: 1,
      list_id: 1,
      description: 'Ebony sword',
      quantity: 1,
      notes: 'notes 1'
    },
    {
      id: 3,
      list_id: 1,
      description: 'Ingredients with "Frenzy" property',
      quantity: 4,
      notes: null
    }
  ]
}

export const removeOrAdjustItemsOnListDestroy = (masterList, items) => {
  const newMasterListItems = []

  for (const item of items) {
    const existingMasterListItem = masterList.list_items.find(listItem => listItem.description.toLowerCase() === item.description.toLowerCase())
    const masterListItem = removeOrAdjustItemOnItemDestroy(existingMasterListItem, item)

    if (!masterListItem) continue // it should be removed from the array

    newMasterListItems.push(masterListItem)
  }

  masterList.list_items = newMasterListItems
  return newMasterListItems.length === 0 ? null : masterList
}

export const removeOrAdjustItemOnItemDestroy = (masterListItem, destroyedItem) => {
  if (masterListItem.quantity === destroyedItem.quantity) return null

  masterListItem.quantity -= destroyedItem.quantity
  if (masterListItem.notes) masterListItem.notes.replace(destroyedItem.notes, '').replace(/^ --/, '').replace(/ -- $/, '')

  return masterListItem
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

export const adjustMasterListItem = (masterListItem, deltaQuantity, oldNotes, newNotes) => {
  masterListItem.quantity = masterListItem.quantity + deltaQuantity

  if (oldNotes !== newNotes) {
    if (masterListItem.notes) {
      masterListItem.notes.replace(oldNotes, newNotes)
    } else {
      masterListItem.notes = newNotes
    }
  }

  return masterListItem
}
