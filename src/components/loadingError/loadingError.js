import React from 'react'
import PropTypes from 'prop-types'
import styles from './loadingError.module.css'

const LoadingError = ({ modelName }) => (
  <div className={styles.root}>
    <p className={styles.text}>
      There was an error loading your {modelName}. It may have been on our end. We're sorry!
    </p>
  </div>
)

LoadingError.propTypes = {
  modelName: PropTypes.oneOf(['games', 'shopping lists', 'inventory lists'])
}

export default LoadingError
