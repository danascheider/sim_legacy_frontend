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

const Loading = ({ className, type = 'bubbles', color, height, width }) => (
  <ReactLoading className={className} type={type} color={color} height={height} width={width} />
)

Loading.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(possibleTypes),
  color: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default Loading
