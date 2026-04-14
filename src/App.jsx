import { useState, useEffect, useCallback } from 'react'

// ── 點按日期選擇器 ──────────────────────────────────────
function SpinField({ label, value, onUp, onDown }) {
  const btn = {
    background: 'none', border: 'none', color: '#ffffff',
    cursor: 'pointer', fontSize: '13px', lineHeight: 1, padding: '4px 8px',
    fontFamily: 'inherit',
  }
  const hoverColor = '#ffffff'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <button
        style={btn}
        onMouseEnter={e => e.currentTarget.style.color = hoverColor}
        onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
        onClick={onUp}
      >▲</button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 400, color: '#fff', lineHeight: 1 }}>
          {String(value).padStart(2, '0')}
        </div>
        <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#ffffff', marginTop: '4px' }}>
          {label}
        </div>
      </div>
      <button
        style={btn}
        onMouseEnter={e => e.currentTarget.style.color = hoverColor}
        onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
        onClick={onDown}
      >▼</button>
    </div>
  )
}

function DatePicker({ value, onChange }) {
  const d = new Date(value || Date.now())
  const set = (fn) => {
    const nd = new Date(d)
    fn(nd)
    onChange(nd.getFullYear() + '-' +
      String(nd.getMonth()+1).padStart(2,'0') + '-' +
      String(nd.getDate()).padStart(2,'0') + 'T' +
      String(nd.getHours()).padStart(2,'0') + ':' +
      String(nd.getMinutes()).padStart(2,'0'))
  }
  const sep = <div style={{ color: '#ffffff', fontSize: '22px', paddingBottom: '28px' }}>:</div>
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', justifyContent: 'center' }}>
      <SpinField label="YEAR"  value={d.getFullYear()} onUp={() => set(n => n.setFullYear(n.getFullYear()+1))}  onDown={() => set(n => n.setFullYear(n.getFullYear()-1))} />
      <div style={{ color: '#ffffff', fontSize: '22px', paddingBottom: '28px' }}>/</div>
      <SpinField label="MON"   value={d.getMonth()+1}  onUp={() => set(n => n.setMonth(n.getMonth()+1))}        onDown={() => set(n => n.setMonth(n.getMonth()-1))} />
      <div style={{ color: '#ffffff', fontSize: '22px', paddingBottom: '28px' }}>/</div>
      <SpinField label="DAYS"   value={d.getDate()}      onUp={() => set(n => n.setDate(n.getDate()+1))}          onDown={() => set(n => n.setDate(n.getDate()-1))} />
      {sep}
      <SpinField label="HOUR"  value={d.getHours()}     onUp={() => set(n => n.setHours(n.getHours()+1))}        onDown={() => set(n => n.setHours(n.getHours()-1))} />
      {sep}
      <SpinField label="MINS"   value={d.getMinutes()}   onUp={() => set(n => n.setMinutes(n.getMinutes()+1))}    onDown={() => set(n => n.setMinutes(n.getMinutes()-1))} />
    </div>
  )
}
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
          fontSize: 'clamp(99px, 10vw, 169px)',
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
          fontSize: '26px',
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
      className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full" style={{ gap: 'clamp(8px, 1.5vh, 20px)', padding: '0 clamp(16px, 5vw, 80px)' }}>

        {/* ONE TEAM + ZERO SHOT 並排 */}
        <div className="absolute top-8 left-0 right-0 md:relative md:top-auto md:left-auto md:right-auto flex flex-col items-center justify-center" style={{ gap: '0.5em', flexWrap: 'nowrap' }}>
          <div className="flex items-center justify-center" style={{ gap: '3em', flexWrap: 'nowrap' }}>
            {['ONE TEAM', 'ZERO-SHOT'].map(text => (
              <p
                key={text}
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 'clamp(13px, 3.16vw, 46px)',
                  letterSpacing: '8px',
                  fontStyle: 'normal',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                {text}
              </p>
            ))}
          </div>
          <p style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: '26px',
            letterSpacing: '0.1em',
            color: '#ffffff',
            whiteSpace: 'nowrap',
          }}>
            🔥 MADISON HUANG VISIT COUNTDOWN 🔥
          </p>
        </div>

        {/* Countdown numbers */}
        <div
          className="flex flex-col md:flex-row items-center md:items-end justify-center"
          style={{ gap: 'clamp(16px, 8vw, 160px)', width: '100%' }}
        >
          <Unit value={pad(days)} label="DAYS" red />
          <Unit value={pad(hours)} label="HRS" />
          <Unit value={pad(minutes)} label="MINS" />
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
                fontSize: '13px',
                letterSpacing: '0.3em',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              Set Countdown Target
            </p>

            <DatePicker value={inputVal} onChange={setInputVal} />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
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
                  fontSize: '12px',
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
