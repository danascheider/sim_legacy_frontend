import React from 'react'
import {
  YELLOW,
  PINK,
  BLUE,
  GREEN,
  AQUA
} from '../../utils/colorSchemes'
import NavigationMosaic from './navigationMosaic'

const cards = [
  {
    colorScheme: YELLOW,
    href: '#',
    children: 'Your Shopping Lists',
    key: 'card-1'
  },
  {
    colorScheme: PINK,
    href: '#',
    children: 'Nav Link 2',
    key: 'card-2'
  },
  {
    colorScheme: BLUE,
    href: '#',
    children: 'Nav Link 3',
    key: 'card-3'
  },
  {
    colorScheme: GREEN,
    href: '#',
    children: 'Nav Link 4',
    key: 'card-4'
  },
  {
    colorScheme: AQUA,
    href: '#',
    children: 'Nav Link 5',
    key: 'card-5'
  }
]

export default { title: 'NavigationMosaic' }

export const Default = () => <NavigationMosaic cardArray={cards} />
