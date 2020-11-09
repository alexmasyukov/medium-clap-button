import React, { useLayoutEffect, useEffect, useState, useRef } from 'react'
import cn from 'classnames'
import mojs from 'mo-js'
import PraySVG from '../assets/noun_pray_28959.svg'
import styles from './index.css'

/**
 * Custom Hook for animation
 */

const useCapAnimation = () => {
  const [timelineElements, setTimelineElements] = useState({})
  const [animationTimeline, setAnimationTimeline] = useState(() => new mojs.Timeline())
  const { 
    clapEl = null, 
    clapCountTotalEl = null, 
    clapCountEl = null 
  } = timelineElements

  console.log('useCapAnimation render');

  useEffect(() => {
    const tlDuration = 300

    console.log('useCapAnimation -> useLayoutEffect');

    console.log(clapEl, clapCountTotalEl, clapCountEl);
    if (!clapEl || !clapCountTotalEl || !clapCountEl) return



    const scaleButton = new mojs.Html({
      el: clapEl,
      duration: tlDuration,
      scale: { 1.3: 1 },
      easing: mojs.easing.ease.out
    })

    const countAnimation = new mojs.Html({
      el: clapCountEl,
      opacity: { 0: 1 },
      duration: tlDuration,
      y: { 0: -30 },
    }).then({
      opacity: { 1: 0 },
      delay: tlDuration / 2,
      y: -80
    })

    const countTotalAnimation = new mojs.Html({
      el: clapCountTotalEl,
      duration: tlDuration,
      opacity: { 0: 1 },
      delay: (3 * tlDuration) / 2,
      y: { 0: -3 }
    })

    const triangleBurst = new mojs.Burst({
      parent: clapEl,
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
      parent: clapEl,
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

    clapEl.style.transform = 'scale(1)'

    const newAnimationTimeline = animationTimeline.add([
      scaleButton,
      countTotalAnimation,
      countAnimation,
      triangleBurst,
      circleBurst
    ])

    setAnimationTimeline(newAnimationTimeline)
  }, [clapEl, clapCountTotalEl, clapCountEl])

  return [animationTimeline, setTimelineElements]
}


const initialState = {
  count: 0,
  countTotal: 250,
  isClicked: false
}


const MediumClap = () => {
  const MAXIMUM_USER_CLAPS = 12
  const clapRef = useRef(null)
  const clapCountTotalRef = useRef(null)
  const clapCountRef = useRef(null)
  const [clapState, setClapState] = useState(initialState)
  const [animationTimaline, setTimelineElements] = useCapAnimation()
  const { count, countTotal, isClicked } = clapState

  useEffect(() => {
    setTimelineElements({
      clapEl: clapRef.current,
      clapCountTotalEl: clapCountTotalRef.current,
      clapCountEl: clapCountRef.current
    })
  }, [])

  // console.log('anim', anim)

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
      ref={clapRef}
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon isClicked={isClicked} />
      <ClapCount ref={clapCountRef} count={count} />
      <ClapTotal ref={clapCountTotalRef} countTotal={countTotal} />
    </button>
  )
}

const ClapIcon = ({ isClicked }) => {
  return <span>
    <PraySVG className={cn(styles.icon, isClicked && styles.checked)} />
  </span>
}

const ClapCount = React.forwardRef(({ count }, ref) => {
  return <span
    ref={ref}
    className={styles.count}
  >
    +{count}
  </span>
})

const ClapTotal = React.forwardRef(({ countTotal }, ref) => {
  return <span
    ref={ref}
    className={styles.total}
  >
    {countTotal}
  </span>
})


export default MediumClap