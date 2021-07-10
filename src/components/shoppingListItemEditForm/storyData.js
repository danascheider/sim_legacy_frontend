export const profileData = {
  id: 32,
  uid: 'dragonborn@gmail.com',
  email: 'dragonborn@gmail.com',
  name: 'Jane Doe',
  image_url: null
}

export const listItemData = {
  id: 838,
  list_id: 2,
  description: 'Ebony sword',
  quantity: 2,
  notes: 'Need some swords to enchant'
}

export const shoppingLists = [
  {
    id: 1,
    title: 'Master',
    master: true,
    list_items: [
      {
        ...listItemData,
        id: 839,
        list_id: 1
      }
    ]
  },
  {
    id: 2,
    title: 'Proudspire Manor',
    master: false,
    list_items: [listItemData]
  }
]
