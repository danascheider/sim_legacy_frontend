import { rest } from 'msw'

export const handlers = [
  rest.get('/users/current', null),
  rest.patch('/shopping_lists/1', null),
  rest.patch('/shopping_lists/3', null)
]
