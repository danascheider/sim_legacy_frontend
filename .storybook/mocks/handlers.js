import { rest } from 'msw'

export const handlers = [
  rest.get('/users/current', (req, res, ctx) => {
    return res(ctx.json({}))
  })
]
