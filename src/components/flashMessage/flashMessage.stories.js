import React from 'react'
import FlashMessage from './flashMessage'

export default { title: 'FlashMessage' }

export const Info = () => (
  <FlashMessage
    type='info'
    header='Just so you know:'
    message='Your changes have been saved.'
  />
)

export const InfoNoHeader = () => <FlashMessage type='info' message='Your changes have been saved.' />

export const Warning = () => (
  <FlashMessage
    type='warning'
    header="I'm warning you:"
    message='Your changes have not been saved.'
  />
)

export const Error = () => (
  <FlashMessage
    type='error'
    header='There was an error saving your changes:'
    message='Title cannot be blank'
  />
)

export const ErrorMultiple = () => (
  <FlashMessage
    type='error'
    header='There were errors saving your changes:'
    message={['Title cannot be blank', 'You are a nerd']}
  />
)
