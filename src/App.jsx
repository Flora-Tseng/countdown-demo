import { useState, useEffect } from 'react'

const FONT = "'Oswald', sans-serif"

function getDefaultTarget() {
  const d = new Date(Date.now() + 38 * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 16)
}

function pad(n) {
  return String(Math.max(0, n)).padStart(2, '0')
}

function getTimeLeft(targetDate) {
  const diff = targetDate - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Unit({ value, label, red }) {
  return (
    <div className="flex items-end" style={{ gap: '0.3em' }}>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 'clamp(72px, 13vw, 220px)',
          lineHeight: 1,
          color: red ? '#dc2020' : '#ffffff',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontSize: 'clamp(10px, 1.1vw, 18px)',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.65)',
          marginBottom: '0.35em',
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default function App() {
  const [targetStr, setTargetStr] = useState(() => {
    return localStorage.getItem('countdown-target') || getDefaultTarget()
  })
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(new Date(targetStr)))
  const [showModal, setShowModal] = useState(false)
  const [inputVal, setInputVal] = useState(targetStr)

  useEffect(() => {
    const target = new Date(targetStr)
    setTimeLeft(getTimeLeft(target))
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [targetStr])

  function handleSave() {
    if (!inputVal) return
    localStorage.setItem('countdown-target', inputVal)
    setTargetStr(inputVal)
    setShowModal(false)
  }

  const { days, hours, minutes, seconds } = timeLeft

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center" style={{ gap: 'clamp(20px, 4vh, 48px)' }}>

        {/* ONE TEAM */}
        <p
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: 'clamp(11px, 1.2vw, 16px)',
            letterSpacing: '0.55em',
            color: 'rgba(255,255,255,0.75)',
            fontStyle: 'italic',
            textTransform: 'uppercase',
          }}
        >
          ONE TEAM
        </p>

        {/* Countdown numbers */}
        <div
          className="flex items-end"
          style={{ gap: 'clamp(24px, 5vw, 80px)' }}
        >
          <Unit value={pad(days)} label="DAY" red />
          <Unit value={pad(hours)} label="HRS" />
          <Unit value={pad(minutes)} label="MIN" />
          <Unit value={pad(seconds)} label="SEC" />
        </div>

        {/* ZERO SHOT */}
        <p
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: 'clamp(11px, 1.2vw, 16px)',
            letterSpacing: '0.55em',
            color: 'rgba(255,255,255,0.75)',
            fontStyle: 'italic',
            textTransform: 'uppercase',
          }}
        >
          ZERO SHOT
        </p>
      </div>

      {/* Set Countdown button */}
      <button
        onClick={() => { setInputVal(targetStr); setShowModal(true) }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          fontFamily: FONT,
          fontWeight: 300,
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '8px 18px',
          background: 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
        }}
      >
        Set Countdown
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div
            style={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '40px',
              minWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 300,
                fontSize: '12px',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
              }}
            >
              Set Countdown Target
            </p>

            <input
              type="datetime-local"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '10px 14px',
                fontFamily: FONT,
                fontSize: '14px',
                outline: 'none',
                width: '100%',
              }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 12px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: '#dc2020',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 20px',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
