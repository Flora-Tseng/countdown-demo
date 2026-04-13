import { useEffect, useRef } from 'react'

const GAP = 10
const SW  = 2

export default function BorderProgress() {
  const pathRef   = useRef(null)
  const rafRef    = useRef(null)
  const perimRef  = useRef(0)

  useEffect(() => {
    function buildPath() {
      const o  = GAP + SW / 2
      const rw = window.innerWidth  - (GAP + SW / 2) * 2
      const rh = window.innerHeight - (GAP + SW / 2) * 2
      perimRef.current = 2 * (rw + rh)

      if (pathRef.current) {
        pathRef.current.setAttribute('d', `M ${o},${o} H ${o+rw} V ${o+rh} H ${o} V ${o}`)
        pathRef.current.style.strokeDasharray = perimRef.current
      }
    }

    function tick() {
      const now  = new Date()
      const secs = now.getSeconds() + now.getMilliseconds() / 1000
      const prog = secs / 60

      if (pathRef.current) {
        pathRef.current.style.strokeDashoffset = perimRef.current * (1 - prog)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    buildPath()
    window.addEventListener('resize', buildPath)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', buildPath)
    }
  }, [])

  return (
    <svg style={{
      position:      'fixed',
      top:           0,
      left:          0,
      width:         '100%',
      height:        '100%',
      pointerEvents: 'none',
      zIndex:        50,
      overflow:      'hidden',
    }}>
      <path
        ref={pathRef}
        fill="none"
        stroke="#000000"
        strokeWidth={SW}
        strokeLinecap="butt"
      />
    </svg>
  )
}
