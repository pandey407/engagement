// Hand-built SVG of the Patan Durbar Square skyline (painted ornaments live in src/assets/theme).

import type { ReactNode } from 'react'

type PagodaProps = { x: number; base: number; tiers: number; wall: number; plinth: number; ground: number }

// Newar multi-tier pagoda: stepped plinth, walls with carved windows, flared roofs, gajur finial.
function Pagoda({ x, base, tiers, wall, plinth, ground }: PagodaProps) {
  const parts: ReactNode[] = []
  let y = ground
  let w = base
  for (let i = 0; i < plinth; i++) {
    parts.push(<rect key={`p${i}`} x={x - w / 2} y={y - 9} width={w} height={9} className="fill-brick" />)
    y -= 9
    w -= 14
  }
  let bodyW = w - 20
  for (let t = 0; t < tiers; t++) {
    const h = t === 0 ? wall : wall * 0.6
    parts.push(<rect key={`w${t}`} x={x - bodyW / 2} y={y - h} width={bodyW} height={h} className="fill-brick" />)
    if (t === 0) {
      for (let k = -1; k <= 1; k++)
        parts.push(
          <rect key={`d${k}`} x={x + k * (bodyW / 3.4) - 5} y={y - h + 8} width={10} height={h - 8} className="fill-maroon-deep" />,
        )
    }
    y -= h
    const eave = bodyW / 2 + 22 - t * 4
    const rise = 22 - t * 2
    parts.push(
      <path
        key={`r${t}`}
        d={`M${x - eave} ${y + 4}Q${x - eave + 6} ${y - 2} ${x - bodyW * 0.32} ${y - rise}H${x + bodyW * 0.32}Q${x + eave - 6} ${y - 2} ${x + eave} ${y + 4}Z`}
        className="fill-maroon"
      />,
    )
    y -= rise
    bodyW *= 0.68
  }
  parts.push(
    <g key="gajur" className="fill-gold">
      <circle cx={x} cy={y - 4} r={4} />
      <circle cx={x} cy={y - 11} r={3} />
      <path d={`M${x - 2} ${y - 13}L${x} ${y - 26} ${x + 2} ${y - 13}Z`} />
    </g>,
  )
  return <g>{parts}</g>
}

// Krishna Mandir: stone shikhara temple with rows of small pavilions.
function KrishnaMandir({ x, ground }: { x: number; ground: number }) {
  const parts: ReactNode[] = []
  let y = ground
  let w = 150
  for (let i = 0; i < 3; i++) {
    parts.push(<rect key={`p${i}`} x={x - w / 2} y={y - 8} width={w} height={8} className="fill-paper stroke-brick/50" />)
    y -= 8
    w -= 12
  }
  const levels = [
    { w: 110, h: 34, chhatris: 5 },
    { w: 86, h: 28, chhatris: 4 },
    { w: 62, h: 24, chhatris: 3 },
  ]
  levels.forEach((lv, li) => {
    parts.push(<rect key={`l${li}`} x={x - lv.w / 2} y={y - lv.h} width={lv.w} height={lv.h} className="fill-paper stroke-brick/50" />)
    const n = Math.floor(lv.w / 14)
    for (let k = 0; k < n; k++)
      parts.push(
        <path
          key={`a${li}-${k}`}
          d={`M${x - lv.w / 2 + 5 + k * 14} ${y}v-${lv.h - 12}a4 4 0 0 1 8 0v${lv.h - 12}Z`}
          className="fill-brick/70"
        />,
      )
    y -= lv.h
    const step = lv.w / (lv.chhatris - 1)
    for (let k = 0; k < lv.chhatris; k++) {
      const cx = x - lv.w / 2 + k * step
      parts.push(
        <g key={`c${li}-${k}`}>
          <rect x={cx - 5} y={y - 8} width={10} height={8} className="fill-paper stroke-brick/50" />
          <path d={`M${cx - 6} ${y - 8}Q${cx} ${y - 22} ${cx + 6} ${y - 8}Z`} className="fill-paper stroke-brick/50" />
          <line x1={cx} y1={y - 18} x2={cx} y2={y - 24} className="stroke-gold" strokeWidth="1.5" />
        </g>,
      )
    }
  })
  parts.push(
    <path
      key="shikhara"
      d={`M${x - 22} ${y}C${x - 22} ${y - 40} ${x - 10} ${y - 70} ${x} ${y - 86}C${x + 10} ${y - 70} ${x + 22} ${y - 40} ${x + 22} ${y}Z`}
      className="fill-paper stroke-brick/60"
    />,
  )
  for (let k = 1; k < 6; k++)
    parts.push(<line key={`b${k}`} x1={x - 21 + k * 1.6} y1={y - k * 13} x2={x + 21 - k * 1.6} y2={y - k * 13} className="stroke-brick/30" />)
  parts.push(
    <g key="fin" className="fill-gold">
      <circle cx={x} cy={y - 90} r={4} />
      <path d={`M${x - 2} ${y - 93}L${x} ${y - 108} ${x + 2} ${y - 93}Z`} />
    </g>,
  )
  return <g>{parts}</g>
}

// Pillar with the kneeling king under a naga hood (Yoganarendra Malla).
function Pillar({ x, ground }: { x: number; ground: number }) {
  return (
    <g>
      <rect x={x - 12} y={ground - 10} width={24} height={10} className="fill-paper stroke-brick/50" />
      <rect x={x - 4} y={ground - 150} width={8} height={140} className="fill-paper stroke-brick/50" />
      <path d={`M${x - 10} ${ground - 150}h20l-4-8h-12Z`} className="fill-paper stroke-brick/50" />
      <path d={`M${x - 6} ${ground - 158}v-10a6 6 0 0 1 12 0v10Z`} className="fill-gold" />
      <path d={`M${x - 11} ${ground - 170}Q${x} ${ground - 192} ${x + 11} ${ground - 170}Z`} className="fill-gold/80" />
      <circle cx={x} cy={ground - 194} r={3} className="fill-gold" />
    </g>
  )
}

export function PatanSkyline({ className = '' }: { className?: string }) {
  const ground = 250
  return (
    <svg viewBox="0 0 1000 260" className={className} role="img" aria-label="Patan Durbar Square">
      <Pagoda x={110} base={170} tiers={3} wall={42} plinth={4} ground={ground} />
      <Pagoda x={300} base={120} tiers={2} wall={34} plinth={3} ground={ground} />
      <Pillar x={420} ground={ground} />
      <KrishnaMandir x={540} ground={ground} />
      <Pagoda x={740} base={150} tiers={3} wall={38} plinth={5} ground={ground} />
      <Pagoda x={900} base={110} tiers={2} wall={30} plinth={3} ground={ground} />
      <rect x={0} y={ground} width={1000} height={10} className="fill-brick/70" />
    </svg>
  )
}
