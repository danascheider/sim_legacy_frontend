import React from 'react'
import PropTypes from 'prop-types'
import ReactLoading from 'react-loading'

const possibleTypes = [
  'blank',
  'balls',
  'bars',
  'bubbles',
  'cubes',
  'cylon',
  'spin',
  'spinningBubbles',
  'spokes'
]

const Loading = ({ type = 'spin', color, height, width }) => (
  <ReactLoading type={type} color={color} height={height} width={width} />
)

Loading.propTypes = {
  type: PropTypes.oneOf(possibleTypes),
  color: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.number.isRequired
}

export default Loading
