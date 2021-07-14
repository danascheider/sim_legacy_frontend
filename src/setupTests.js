// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import React from 'react'
import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import '@testing-library/jest-dom'

export const renderWithRouter = (ui, { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {}) => {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history
  }
}

export const mockCookies = value => {
  Object.defineProperty(window.document, 'cookie', { writable: true, value: value })
}

export const mockWindowLocation = value => {
  const oldLocation = window.location
  delete window.location
  window.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldLocation),
      pathname: {
        configurable: true,
        value: value
      }
    }
  )
}
