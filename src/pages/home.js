import React from 'react'
import { Link } from 'react-router-dom'
import styles from './home.module.css'

const Home = () => (
  <div className={styles.root}>
    <h1 className={styles.header}>Skyrim Inventory Management</h1>
    <Link className={styles.login} to='/login'>Log in with Google</Link>
  </div>
)

export default Home
