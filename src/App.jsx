import { useState, useEffect } from 'react'
import BorderProgress from './BorderProgress'

const FONT = "'Red Rose', sans-serif"


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
    <div className="flex flex-col items-center" style={{ gap: '8px' }}>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 'clamp(50px, 9.1vw, 154px)',
          lineHeight: 1,
          color: red ? '#dc2020' : '#ffffff',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
          display: 'inline-block',
          width: '2.2ch',
          textAlign: 'center',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: '24px',
          letterSpacing: '0.2em',
          color: red ? '#dc2020' : '#ffffff',
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
    <>
    <BorderProgress />
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full" style={{ gap: 'clamp(8px, 1.5vh, 20px)', padding: '0 clamp(16px, 5vw, 80px)' }}>

        {/* ONE TEAM + ZERO SHOT 並排 */}
        <div className="flex items-center justify-center" style={{ gap: '3em' }}>
          {['ONE TEAM', 'ZERO-SHOT'].map(text => (
            <p
              key={text}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 'clamp(16px, 2.5vw, 36px)',
                letterSpacing: '8px',
                fontStyle: 'normal',
                textTransform: 'uppercase',
                color: '#ffffff',
              }}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Countdown numbers */}
        <div
          className="flex items-end flex-wrap justify-center"
          style={{ gap: 'clamp(40px, 8vw, 160px)', width: '100%' }}
        >
          <Unit value={pad(days)} label="DAY" red />
          <Unit value={pad(hours)} label="HRS" />
          <Unit value={pad(minutes)} label="MIN" />
        </div>
      </div>


      {/* Logo */}
      <img
        src="/logo_primary_horizontal_EN.svg"
        alt="Logo"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '40px',
          width: 'auto',
        }}
      />

      {/* Set Countdown button */}
      <button
        onClick={() => { setInputVal(targetStr); setShowModal(true) }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s, transform 0.2s',
          padding: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.55)'; e.currentTarget.style.transform = 'scale(1.6)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.25)'; e.currentTarget.style.transform = 'scale(1)' }}
      />

      {/* HOKI.gif */}
      <img
        src="/HOKI.gif"
        alt="HOKI"
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: 'auto',
        }}
      />

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
    </>
  )
}
