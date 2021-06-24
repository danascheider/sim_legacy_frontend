export const userData = {
  id: 24,
  name: 'Jane Doe',
  email: 'jane.doe@gmail.com',
  uid: 'jane.doe@gmail.com',
  image_url: null
}

export const emptyShoppingLists = []

export const shoppingLists = [
  {
    id: 2,
    user_id: 24,
    master: true,
    title: 'Master',
    shopping_list_items: [
      {
        id: 2,
        shopping_list_id: 2,
        description: 'Ebony sword',
        quantity: 2,
        notes: 'notes 1 -- notes 2'
      },
      {
        id: 4,
        shopping_list_id: 2,
        description: 'Ingredients with "Frenzy" property',
        quantity: 4,
        notes: null
      }
    ]
  },
  {
    id: 1,
    user_id: 24,
    master: false,
    title: 'Heljarchen Hall',
    shopping_list_items: [
      {
        id: 1,
        shopping_list_id: 1,
        description: 'Ebony sword',
        quantity: 1,
        notes: 'notes 1'
      },
      {
        id: 3,
        shopping_list_id: 1,
        description: 'Ingredients with "Frenzy" property',
        quantity: 4,
        notes: null
      }
    ]
  },
  {
    id: 3,
    user_id: 24,
    master: false,
    title: 'Lakeview Manor',
    shopping_list_items: [
      {
        id: 5,
        shopping_list_id: 3,
        description: 'Ebony sword',
        quantity: 1,
        notes: 'notes 2'
      }
    ]
  }
]

export const shoppingListUpdateData1 = {
  id: 1,
  user_id: 24,
  master: false,
  shopping_list_items: [
    {
      id: 1,
      shopping_list_id: 1,
      description: 'Ebony sword',
      quantity: 1,
      notes: 'notes 1'
    },
    {
      id: 3,
      shopping_list_id: 1,
      description: 'Ingredients with "Frenzy" property',
      quantity: 4,
      notes: null
    }
  ]
}

export const shoppingListUpdateData2 = {
  id: 3,
  user_id: 24,
  master: false,
  shopping_list_items: [
    {
      id: 5,
      shopping_list_id: 3,
      description: 'Ebony sword',
      quantity: 1,
      notes: 'notes 2'
    }
  ]
}
