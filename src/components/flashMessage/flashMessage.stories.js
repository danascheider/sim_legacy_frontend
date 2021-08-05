import React from 'react'
import { AppProvider } from '../../contexts/appContext'
import { profileData } from '../../sharedTestData'
import FlashMessage from './flashMessage'

export default { title: 'FlashMessage' }

export const Success = () => (
  <AppProvider
    overrideValue={{
      profileData,
      flashVisible: true,
      flashAttributes: {
        type: 'success',
        header: 'Success!',
        message: 'You have succeeded.'
      }
    }}
  >
    <FlashMessage />
  </AppProvider>
)


export const Info = () => (
  <AppProvider
    overrideValue={{
      profileData,
      flashVisible: true,
      flashAttributes: {
        type: 'info',
        header: 'Just so you know:',
        message: 'Your changes have been saved.'
      }
    }}
  >
    <FlashMessage />
  </AppProvider>
)

export const InfoNoHeader = () => (
  <AppProvider
    overrideValue={{
      profileData,
      flashVisible: true,
      flashAttributes: {
        type: 'info',
        message: 'Your changes have been saved.'
      }
    }}
  >
    <FlashMessage />
  </AppProvider>
)

export const Warning = () => (
  <AppProvider
    overrideValue={{
      profileData,
      flashVisible: true,
      flashAttributes: {
        type: 'warning',
        header: "I'm warning you:",
        message: 'Your changes have not been saved.'
      }
    }}
  >
    <FlashMessage />
  </AppProvider>
)

export const Error = () => (
  <AppProvider
    overrideValue={{
      profileData,
      flashVisible: true,
      flashAttributes: {
        type: 'error',
        header: 'There was an error saving your changes:',
        message: 'Title cannot be blank.'
      }
    }}
  >
    <FlashMessage />
  </AppProvider>
)

export const ErrorMultiple = () => (
  <AppProvider
    overrideValue={{
      profileData,
      flashVisible: true,
      flashAttributes: {
        type: 'error',
        header: 'There were errors saving your changes:',
        message: ['Title cannot be blank', 'You are a nerd']
      }
    }}
  >
    <FlashMessage />
  </AppProvider>
)
