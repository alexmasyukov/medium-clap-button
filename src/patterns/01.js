import React from 'react'
import PraySVG from '../assets/noun_pray_28959.svg'
import styles from './index.css'
import { useState } from 'react';

const initialState = {
  count: 0,
  countTotal: 267
}

const MediumClap = () => {
  const [clapState, setClapState] = useState(initialState)
  const { count, countTotal } = clapState

  const handleClapClick = () => {
    setClapState(prev => ({
      count: prev.count + 1,
      countTotal: prev.countTotal + 1
    }))
  }

  return (
    <button className={styles.clap} onClick={handleClapClick}>
      <ClapIcon />
      <ClapCount count={count} />
      <ClapTotal countTotal={countTotal} />
    </button>
  )
}

const ClapIcon = () => {
  return <span>
    <PraySVG className={styles.icon} />
  </span>
}

const ClapCount = ({ count }) => {
  return <span className={styles.count}>
    +{count}
  </span>
}

const ClapTotal = ({ countTotal }) => {
  return <span className={styles.total}>
    {countTotal}
  </span>
}

export default MediumClap