import React, {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  useMemo,
  createContext
} from 'react'
import cn from 'classnames'
import mojs from 'mo-js'
import PraySVG from '../assets/noun_pray_28959.svg'
import styles from './index.css'
import userCustomStyles from './usage.css'

const Func = () => { }

function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current)
      fn();
    else
      didMountRef.current = true;
  }, inputs);
}


/**
 * Custom Hook for animation
 */
const useCapAnimation = ({
  clapEl = null,
  countTotalEl = null,
  countEl = null
}) => {
  const [animationTimeline, setAnimationTimeline] = useState(() => new mojs.Timeline())

  useLayoutEffect(() => {
    const tlDuration = 300

    if (!clapEl || !countTotalEl || !countEl) return

    const scaleButton = new mojs.Html({
      el: clapEl,
      duration: tlDuration,
      scale: { 1.3: 1 },
      easing: mojs.easing.ease.out
    })

    const countAnimation = new mojs.Html({
      el: countEl,
      opacity: { 0: 1 },
      duration: tlDuration,
      y: { 0: -30 },
    }).then({
      opacity: { 1: 0 },
      delay: tlDuration / 2,
      y: -80
    })

    const countTotalAnimation = new mojs.Html({
      el: countTotalEl,
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
  }, [clapEl, countTotalEl, countEl])

  return animationTimeline
}


const MediumClapContext = createContext()
const { Provider } = MediumClapContext

/**
 * base component
 */
const initialState = {
  count: 0,
  countTotal: 250,
  isClicked: false
}

const MediumClap = ({
  children,
  onClap = Func,
  style: userStyle = {},
  className
}) => {
  const MAXIMUM_USER_CLAPS = 12
  const [clapState, setClapState] = useState(initialState)
  const { count } = clapState
  const [{ clapRef, clapCountTotalRef, clapCountRef }, setRefState] = useState([])

  const animationTimaline = useCapAnimation({
    clapEl: clapRef,
    countEl: clapCountRef,
    countTotalEl: clapCountTotalRef,
  })

  const setRef = useCallback(node => {
    setRefState(prev => ({
      ...prev,
      [node.dataset.refkey]: node
    }))
  }, [])

  useDidUpdateEffect(() => {
    onClap && onClap(count)
  }, [count])

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

  const memoizedValue = useMemo(() => ({
    ...clapState,
    setRef
  }), [clapState])

  return (
    <Provider value={memoizedValue}>
      <button
        data-refkey="clapRef"
        ref={setRef}
        className={cn(styles.clap, className)}
        onClick={handleClapClick}
        style={userStyle}
      >
        {children}
      </button>
    </Provider>
  )
}

/**
 * subcomponents
 */

const ClapIcon = ({
  style: userStyle = {},
  className
}) => {
  const { isClicked } = useContext(MediumClapContext)
  return <span style={userStyle}>
    <PraySVG className={cn(
      styles.icon,
      isClicked && styles.checked,
      className
    )} />
  </span>
}

const ClapCount = ({
  style: userStyle = {},
  className
}) => {
  const { count, setRef } = useContext(MediumClapContext)
  return <span
    data-refkey="clapCountRef"
    ref={setRef}
    className={cn(styles.count, className)}
    style={userStyle}
  >
    +{count}
  </span>
}

const ClapTotal = ({
  style: userStyle = {},
  className
}) => {
  const { countTotal, setRef } = useContext(MediumClapContext)
  return <span
    data-refkey="clapCountTotalRef"
    ref={setRef}
    className={cn(styles.total, className)}
    style={userStyle}
  >
    {countTotal}
  </span>
}

MediumClap.Icon = ClapIcon
MediumClap.Count = ClapCount
MediumClap.Total = ClapTotal

/**
 * How use
 */

const Usage = () => {
  const [count, setCount] = useState(0)

  const handleClap = (count) => {
    setCount(count)
  }

  return (
    <div>
      <MediumClap onClap={handleClap} className={userCustomStyles.clap}>
        <MediumClap.Icon className={userCustomStyles.icon} />
        <MediumClap.Count className={userCustomStyles.count} />
        <MediumClap.Total className={userCustomStyles.total} />
      </MediumClap>
      <div className={styles.info}>{`You have clapped ${count}`}</div>
    </div>
  )
}

export default Usage