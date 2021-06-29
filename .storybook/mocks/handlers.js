import { rest } from 'msw'

export const handlers = [
  rest.get('/users/current', null),
  rest.post('/shopping_lists', null),
  rest.patch('/shopping_lists/1', null),
  rest.patch('/shopping_lists/3', null),
  rest.patch('/shopping_lists/32', null)
]
