import { addDecorator } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

if (typeof global.process === 'undefined') {
  const { worker } = require('./mocks/browser')
  worker.start()
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

addDecorator(story => <BrowserRouter>{story()}</BrowserRouter>)
