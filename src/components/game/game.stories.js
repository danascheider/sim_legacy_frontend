import React from 'react'
import Game from './game'

export default { title: 'Game' }

export const Default = () => <Game name='My Game 1' description='My first game, idk' />

export const NoDescription = () => <Game name='My Game 1' description={null} />
