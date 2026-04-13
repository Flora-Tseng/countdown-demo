import { useEffect, useRef } from 'react'

// ─── 設定 ────────────────────────────────────────────
// 低解析度 → 每像素被放大成大方塊，貼近 reference 風格
const FW = 80        // 火焰緩衝寬（像素數）
const FH = 28        // 火焰緩衝高
const CW = FW
const CH = 55        // canvas 總高（含火花飄浮空間）
const FIRE_TOP = CH - FH   // 火焰在 canvas 的起始 Y

// ─── 色盤：暗背景輝光 → 深紅 → 橙 → 黃 → 亮黃 → 白核心 ──
function makePalette() {
  const p = new Uint8ClampedArray(256 * 4)

  function set(i, r, g, b, a) {
    p[i*4]=r; p[i*4+1]=g; p[i*4+2]=b; p[i*4+3]=a
  }

  for (let i = 0; i < 256; i++) {
    if (i < 50)         set(i,   0,   0,   0,   0)    // 完全透明（消除背景色塊）
    else if (i < 85)    set(i, 120,  15,   0, 160)   // 深棕紅
    else if (i < 120)   set(i, 195,  45,   0, 200)   // 深橘紅
    else if (i < 155)   set(i, 240,  95,   0, 220)   // 橙
    else if (i < 185)   set(i, 255, 160,   5, 235)   // 琥珀橙
    else if (i < 215)   set(i, 255, 215,  25, 245)   // 亮黃
    else if (i < 240)   set(i, 255, 245,  90, 250)   // 淡黃
    else                set(i, 255, 255, 200, 254)   // 白核心
  }
  return p
}

const PALETTE = makePalette()

// ─── 火花類型 ─────────────────────────────────────────
function newSpark(xBase) {
  const angle = -(Math.PI * 0.3 + Math.random() * Math.PI * 0.4)  // 往上扇形
  const speed = 0.3 + Math.random() * 0.7
  return {
    x:       xBase + (Math.random() - 0.5) * FW * 0.6,
    y:       FIRE_TOP + 2 + Math.random() * 6,
    vx:      Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1),
    vy:      Math.sin(angle) * speed,
    life:    0,
    maxLife: 35 + Math.floor(Math.random() * 55),
    size:    Math.random() < 0.3 ? 2 : 1,  // 偶爾 2×2 大火花
    bright:  180 + Math.floor(Math.random() * 75),
  }
}

// ─── 元件 ────────────────────────────────────────────
export default function PixelFire() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const buf = new Uint8Array(FW * FH)
    const imageData = ctx.createImageData(CW, CH)
    const sparks = []
    let frame = 0
    let rafId

    // 底部點火：中間最亮，向兩側稍弱，加波浪
    function seedBottom() {
      const t = frame * 0.025
      for (let x = 0; x < FW; x++) {
        const center = Math.exp(-Math.pow((x / FW - 0.5) * 2.5, 2))  // 中間高斯加亮
        const wave   = Math.sin(x * 0.18 + t) * 12 + Math.sin(x * 0.07 + t * 0.6) * 8
        const heat   = 215 + center * 40 + wave + Math.random() * 20
        buf[(FH-1)*FW + x] = Math.min(255, Math.max(200, heat))
        buf[(FH-2)*FW + x] = Math.min(255, Math.max(180, heat - 15 + Math.random() * 15))
      }
    }

    // 熱度向上擴散
    function propagate() {
      for (let y = 0; y < FH - 2; y++) {
        for (let x = 0; x < FW; x++) {
          const dx    = Math.floor(Math.random() * 3) - 1
          const nx    = (x + dx + FW) % FW
          const decay = 2 + Math.floor(Math.random() * 4)
          buf[y*FW + x] = Math.max(0, buf[(y+2)*FW + nx] - decay)
        }
      }
    }

    // 產生火花（對應火焰較熱的區域）
    function maybeSpark() {
      if (sparks.length >= 22) return
      // 熱區多點幾個
      if (Math.random() < 0.18) {
        const hotX = FW * 0.5 + (Math.random() - 0.5) * FW * 0.7
        sparks.push(newSpark(hotX))
      }
    }

    function updateSparks() {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x  += s.vx
        s.y  += s.vy
        s.vy += 0.015   // 輕微重力
        s.vx *= 0.99    // 空氣阻力
        s.life++
        if (s.life >= s.maxLife || s.y < -2 || s.x < -2 || s.x >= CW + 2) {
          sparks.splice(i, 1)
        }
      }
    }

    function render() {
      const d = imageData.data
      d.fill(0)

      // 火焰像素
      for (let y = 0; y < FH; y++) {
        for (let x = 0; x < FW; x++) {
          const v  = buf[y * FW + x]
          if (v === 0) continue
          const ci = ((FIRE_TOP + y) * CW + x) * 4
          const p  = v * 4
          d[ci]   = PALETTE[p]
          d[ci+1] = PALETTE[p+1]
          d[ci+2] = PALETTE[p+2]
          d[ci+3] = PALETTE[p+3]
        }
      }

      // 火花像素（支援 1×1 或 2×2）
      for (const s of sparks) {
        const px    = Math.round(s.x)
        const py    = Math.round(s.y)
        const fade  = 1 - s.life / s.maxLife
        const alpha = Math.floor(s.bright * fade * fade)  // 二次淡出
        const sz    = s.size

        for (let dy = 0; dy < sz; dy++) {
          for (let dx = 0; dx < sz; dx++) {
            const nx = px + dx, ny = py + dy
            if (nx >= 0 && nx < CW && ny >= 0 && ny < CH) {
              const ci = (ny * CW + nx) * 4
              // 火花顏色：亮黃偏白
              const g = Math.min(255, 180 + Math.floor(fade * 75))
              d[ci]   = 255
              d[ci+1] = g
              d[ci+2] = Math.floor(fade * 60)
              d[ci+3] = alpha
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    function loop() {
      frame++
      {   // 每幀更新
        seedBottom()
        propagate()
        maybeSpark()
        updateSparks()
      }
      render()
      rafId = requestAnimationFrame(loop)
    }

    loop()
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '200px',
      pointerEvents: 'none',
      zIndex: 5,
    }}>
      {/* 底部環境輝光 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '5%',
        right: '5%',
        height: '70px',
        background: 'radial-gradient(ellipse 90% 100% at 50% 100%, rgba(255,80,0,0.22) 0%, transparent 70%)',
        filter: 'blur(16px)',
      }} />

      {/* 像素火焰 canvas */}
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '200px',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}
