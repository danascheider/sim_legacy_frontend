import { addDecorator } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { initialize, mswDecorator } from 'msw-storybook-addon'

initialize()
addDecorator(mswDecorator)

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
