import { rest } from 'msw'

export const handlers = [
  rest.get('/users/current', null),
  rest.post('/shopping_lists', null),
  rest.patch('/shopping_lists/:id', null),
  rest.delete('/shopping_lists/:id', null),
  rest.post('/shopping_lists/:id/shopping_list_items', null),
  rest.patch('/shopping_list_items/:id', null),
  rest.delete('/shopping_list_items/:id', null)
]
