import React from 'react'
import { rest } from 'msw'
import { backendBaseUri } from '../../utils/config'
import { AppProvider } from '../../contexts/appContext'
import { GamesProvider } from '../../contexts/gamesContext'
import { profileData, emptyGames, games } from './testData'
import GamesPage from './gamesPage'

const appContextOverrideValue = {
  token: 'xxxxxx',
  profileData
}

export default { title: 'GamesPage' }

/*
 *
 * When the user is logged in, has games, and games are able to be
 * created and updated without incident (pending addition of this
 * functionality).
 * 
 */

export const HappyPath = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <GamesProvider overrideValue={{ gameLoadingState: 'done', games }}>
      <GamesPage />
    </GamesProvider>
  </AppProvider>
)

HappyPath.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(games)
      )
    }),
    rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
      const name = req.body.game.name
      const description = req.body.game.description

      const body = { name, description, id: Math.floor(Math.random() * 10000 + 1), user_id: profileData.id }

      return res(
        ctx.status(201),
        ctx.json(body)
      )
    }),
    rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
      const gameId = parseInt(req.params.id)
      const name = req.body.game.name
      const description = req.body.game.description

      const body = { name, description, id: gameId, user_id: profileData.id }

      return res(
        ctx.status(200),
        ctx.json(body)
      )
    }),
    rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
      return res(
        ctx.status(204)
      )
    })
  ]
}

/*
 *
 * When the user is logged in and has no games but everything works
 * 
 */

export const HappyPathEmpty = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <GamesProvider overrideValue={{ gameLoadingState: 'done', games: emptyGames }}>
      <GamesPage />
    </GamesProvider>
  </AppProvider>
)

HappyPathEmpty.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(emptyGames)
      )
    }),
    rest.post(`${backendBaseUri}/games`, (req, res, ctx) => {
      const name = req.body.game.name
      const description = req.body.game.description

      const body = { name, description, id: Math.floor(Math.random() * 10000 + 1), user_id: profileData.id }

      return res(
        ctx.status(201),
        ctx.json(body)
      )
    }),
    rest.patch(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
      const gameId = parseInt(req.params.id)
      const name = req.body.game.name
      const description = req.body.game.description

      const body = { name, description, id: gameId, user_id: profileData.id }

      return res(
        ctx.status(200),
        ctx.json(body)
      )
    }),
    rest.delete(`${backendBaseUri}/games/:id`, (req, res, ctx) => {
      return res(
        ctx.status(204)
      )
    })
  ]
}

/*
 *
 * When the games are loading
 *
 */

export const Loading = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <GamesProvider overrideValue={{ gameLoadingState: 'loading', games: emptyGames }}>
      <GamesPage />
    </GamesProvider>
  </AppProvider>
)

/*
 *
 * When the server returns a 500 error or another unexpected
 * error is raised
 *
 */

export const Error = () => (
  <AppProvider overrideValue={appContextOverrideValue}>
    <GamesProvider>
      <GamesPage />
    </GamesProvider>
  </AppProvider>
)

Error.parameters = {
  msw: [
    rest.get(`${backendBaseUri}/games`, (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ errors: ['Something went horribly wrong'] })
      )
    })
  ]
}
