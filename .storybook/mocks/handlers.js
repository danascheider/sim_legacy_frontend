import { rest } from 'msw'

export const handlers = [
  rest.get('/users/current', (req, res, ctx) => {
    return res(ctx.json({}))
  }),
  rest.patch('/shopping_lists/1', null),
  rest.patch('/shopping_lists/3', null)
]
