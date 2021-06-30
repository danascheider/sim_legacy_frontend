import { rest } from 'msw'

export const handlers = [
  rest.get('/users/current', null),
  rest.post('/shopping_lists', null),
  rest.patch('/shopping_lists/:id', null),
]
