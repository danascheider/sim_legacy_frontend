import React from 'react'
import NavigationMosaic from './navigationMosaic'

const cards = [
  {
    backgroundColor: '#FFBF00',
    textColor: '#000000',
    href: '#',
    children: 'Your Shopping Lists',
    key: 'card-1'
  },
  {
    backgroundColor: '#E83F6F',
    textColor: '#FFFFFF',
    href: '#',
    children: 'Nav Link 2',
    key: 'card-2'
  },
  {
    backgroundColor: '#2274A5',
    textColor: '#FFFFFF',
    href: '#',
    children: 'Nav Link 3',
    key: 'card-3'
  },
  {
    backgroundColor: '#00A323',
    textColor: '#FFFFFF',
    href: '#',
    children: 'Nav Link 4',
    key: 'card-4'
  },
  {
    backgroundColor: '#20E2E9',
    textColor: '#000000',
    href: '#',
    children: 'Nav Link 5',
    key: 'card-5'
  }
]

export default { title: 'NavigationMosaic' }

export const Default = () => <NavigationMosaic cardArray={cards} />
