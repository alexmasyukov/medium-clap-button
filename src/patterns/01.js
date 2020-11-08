import React from 'react'
import cn from 'classnames'
import mojs from 'mo-js'
import PraySVG from '../assets/noun_pray_28959.svg'
import styles from './index.css'
import { useState } from 'react'

const withClapAntimation = (WrappedComponent) => {
  class withClapAntimation extends React.Component {
    animationTimeline = new mojs.Timeline()

    state = {
      animationTimeline: this.animationTimeline
    }

    componentDidMount() {
      const tlDuration = 300

      const scaleButton = new mojs.Html({
        el: '#clap',
        duration: tlDuration,
        scale: { 1.3: 1 },
        easing: mojs.easing.ease.out
      })

      const countAnimation = new mojs.Html({
        el: '#clapCount',
        opacity: { 0: 1 },
        duration: tlDuration,
        y: { 0: -30 },
      }).then({
        opacity: { 1: 0 },
        delay: tlDuration / 2,
        y: -80
      })

      const countTotalAnimation = new mojs.Html({
        el: '#clapCountTotal',
        duration: tlDuration,
        opacity: { 0: 1 },
        delay: (3 * tlDuration) / 2,
        y: { 0: -3 }
      })

      const triangleBurst = new mojs.Burst({
        parent: '#clap',
        radius: { 50: 95 },
        count: 5,
        angle: 30,
        children: {
          shape: 'polygon',
          radius: { 6: 0 },
          stroke: 'rgba(211,54,0,0.5)',
          strokeWidth: 2,
          angle: 210,
          delay: 30,
          speed: 0.2,
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
          duration: tlDuration
        }
      })

      const circleBurst = new mojs.Burst({
        parent: '#clap',
        radius: { 50: 75 },
        angle: 25,
        duration: tlDuration,
        children: {
          shape: 'circle',
          fill: 'rgba(149,165,166,0.5)',
          delay: 30,
          speed: 0.2,
          radius: { 3: 0 },
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
        }
      })

      const clap = document.getElementById('clap')
      clap.style.transform = 'scale(1)'

      const newAnimationTimeline = this.animationTimeline.add([
        scaleButton,
        countTotalAnimation,
        countAnimation,
        triangleBurst,
        circleBurst
      ])

      this.setState({
        animationTimeline: newAnimationTimeline
      })
    }

    render() {
      return <WrappedComponent
        {...this.props}
        animationTimaline={this.state.animationTimeline}
      />
    }
  }

  withClapAntimation.displayName = `withClapAntimation(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return withClapAntimation
}


const initialState = {
  count: 0,
  countTotal: 250,
  isClicked: false
}

const MediumClap = ({ animationTimaline }) => {
  const MAXIMUM_USER_CLAPS = 12
  const [clapState, setClapState] = useState(initialState)
  const { count, countTotal, isClicked } = clapState

  const handleClapClick = () => {
    animationTimaline.replay()

    setClapState(prev => ({
      isClicked: true,
      count: Math.min(prev.count + 1, MAXIMUM_USER_CLAPS),
      countTotal:
        count < MAXIMUM_USER_CLAPS
          ? prev.countTotal + 1
          : prev.countTotal
    }))
  }

  return (
    <button
      id="clap"
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} />
      <ClapTotal countTotal={countTotal} />
    </button>
  )
}

const ClapIcon = ({ isClicked }) => {
  return <span>
    <PraySVG className={cn(styles.icon, isClicked && styles.checked)} />
  </span>
}

const ClapCount = ({ count }) => {
  return <span
    id="clapCount"
    className={styles.count}
  >
    +{count}
  </span>
}

const ClapTotal = ({ countTotal }) => {
  return <span
    id="clapCountTotal"
    className={styles.total}
  >
    {countTotal}
  </span>
}

const Usage = () => {
  const WithAnimation = withClapAntimation(MediumClap)
  return <WithAnimation />
}

export default Usage