import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './GridOverlay.module.css'

// ─── Excel grid ───────────────────────────────────────────────────────────────

const COLS      = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const ROW_COUNT = 14

const DATA: Record<string, string> = {
  // Headers
  '1-1': 'Year',  '2-1': 'Qtr',  '3-1': 'Month', '4-1': 'Sales',   '5-1': 'Costs',   '6-1': 'GM%',    '7-1': 'Fcast',   '8-1': 'Δ',
  // Q1
  '1-2': '2024',  '2-2': 'Q1',   '3-2': 'Jan',   '4-2': '18.5k',   '5-2': '13.0k',   '6-2': '29.7%',  '7-2': '19.5k',   '8-2': '+5.4%',
  '1-3': '2024',  '2-3': 'Q1',   '3-3': 'Feb',   '4-3': '16.0k',   '5-3': '11.4k',   '6-3': '28.7%',  '7-3': '17.0k',   '8-3': '+6.3%',
  '1-4': '2024',  '2-4': 'Q1',   '3-4': 'Mar',   '4-4': '22.5k',   '5-4': '15.3k',   '6-4': '32.0%',  '7-4': '23.5k',   '8-4': '+4.4%',
  // Q2
  '1-5': '2024',  '2-5': 'Q2',   '3-5': 'Apr',   '4-5': '24.8k',   '5-5': '16.6k',   '6-5': '33.1%',  '7-5': '25.5k',   '8-5': '+2.8%',
  '1-6': '2024',  '2-6': 'Q2',   '3-6': 'May',   '4-6': '26.5k',   '5-6': '17.5k',   '6-6': '34.0%',  '7-6': '27.5k',   '8-6': '+3.8%',
  '1-7': '2024',  '2-7': 'Q2',   '3-7': 'Jun',   '4-7': '28.0k',   '5-7': '18.2k',   '6-7': '35.0%',  '7-7': '29.0k',   '8-7': '+3.6%',
  // Q3
  '1-8': '2024',  '2-8': 'Q3',   '3-8': 'Jul',   '4-8': '25.5k',   '5-8': '16.8k',   '6-8': '34.1%',  '7-8': '26.0k',   '8-8': '+2.0%',
  '1-9': '2024',  '2-9': 'Q3',   '3-9': 'Aug',   '4-9': '23.5k',   '5-9': '15.5k',   '6-9': '34.0%',  '7-9': '24.0k',   '8-9': '+2.1%',
  '1-10':'2024',  '2-10':'Q3',   '3-10':'Sep',   '4-10':'30.0k',   '5-10':'19.5k',   '6-10':'35.0%',  '7-10':'31.0k',   '8-10':'+3.3%',
  // Q4
  '1-11':'2024',  '2-11':'Q4',   '3-11':'Oct',   '4-11':'31.5k',   '5-11':'20.2k',   '6-11':'35.9%',  '7-11':'32.5k',   '8-11':'+3.2%',
  '1-12':'2024',  '2-12':'Q4',   '3-12':'Nov',   '4-12':'33.0k',   '5-12':'20.9k',   '6-12':'36.7%',  '7-12':'34.0k',   '8-12':'+3.0%',
  '1-13':'2024',  '2-13':'Q4',   '3-13':'Dec',   '4-13':'36.0k',   '5-13':'22.3k',   '6-13':'38.1%',  '7-13':'37.0k',   '8-13':'+2.8%',
  // Totals
  '1-14':'Total',                                  '4-14':'315.8k',  '5-14':'207.2k',  '6-14':'34.4%',  '7-14':'326.5k',  '8-14':'+3.4%',
}

// Cells that can randomly highlight on idle
const PULSE_KEYS = Array.from({ length: 12 }, (_, i) =>
  ['4', '5', '6', '7', '8'].map(c => `${c}-${i + 2}`)
).flat()

const HEADER_KEYS = new Set(['1-1','2-1','3-1','4-1','5-1','6-1','7-1','8-1'])
const TOTAL_KEYS  = new Set(['1-14','4-14','5-14','6-14','7-14','8-14'])
const CENTER_COLS = new Set([1, 2, 3])
const DELTA_KEYS  = new Set(
  Array.from({ length: 13 }, (_, i) => `8-${i + 2}`)
)

// ─── Dashboard card ───────────────────────────────────────────────────────────

const MONTHLY_BARS = [
  { h: 51, label: 'J' }, { h: 44, label: 'F' }, { h: 63, label: 'M' },
  { h: 69, label: 'A' }, { h: 74, label: 'M' }, { h: 78, label: 'J' },
  { h: 71, label: 'J' }, { h: 65, label: 'A' }, { h: 83, label: 'S' },
  { h: 88, label: 'O' }, { h: 92, label: 'N' }, { h: 100, label: 'D' },
]

function DashCard() {
  const handleClick = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <motion.div
      className={styles.dashCard}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
      whileHover={{ y: -3, scale: 1.015 }}
      role="button"
      tabIndex={0}
      aria-label="View our services"
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className={styles.dashHeader}>
        <span className={styles.dashDot} />
        <span className={styles.dashTitle}>Sales 2024</span>
        <span className={styles.dashChip}>↗ Live</span>
      </div>
      <div className={styles.barChart}>
        {MONTHLY_BARS.map((bar, i) => (
          <div key={i} className={styles.barWrap}>
            <motion.div
              className={`${styles.bar} ${bar.h === 100 ? styles.barHi : ''}`}
              initial={{ height: 0 }}
              animate={{ height: `${bar.h}%` }}
              transition={{ delay: 1.5 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className={styles.barLabel}>{bar.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.dashFooter}>
        <span className={styles.dashStat}>€315.8k</span>
        <span className={styles.dashLabel}>total · GM 34.4%</span>
      </div>
    </motion.div>
  )
}

// ─── Code card ────────────────────────────────────────────────────────────────

type TokenType = 'kw' | 'id' | 'st' | 'cm' | 'op' | 'nm'
type Token = { t: string; c: TokenType }

const CODE: Token[][] = [
  [{ t: 'import ', c: 'kw' }, { t: 'pandas', c: 'id' }, { t: ' as ', c: 'kw' }, { t: 'pd', c: 'id' }],
  [{ t: '# load & transform', c: 'cm' }],
  [{ t: 'df', c: 'id' }, { t: ' = pd.read_csv(', c: 'id' }, { t: "'data.csv'", c: 'st' }, { t: ')', c: 'id' }],
  [{ t: "df", c: 'id' }, { t: "['score']", c: 'st' }, { t: ' = df.apply(', c: 'id' }],
  [{ t: '  lambda ', c: 'kw' }, { t: 'x: x.rev ', c: 'id' }, { t: '/', c: 'op' }, { t: ' x.cost,', c: 'id' }],
  [{ t: '  axis', c: 'id' }, { t: '=', c: 'op' }, { t: '1', c: 'nm' }, { t: ')', c: 'id' }],
]

const TOK: Record<TokenType, string> = {
  kw: styles.tokKw, id: styles.tokId, st: styles.tokSt,
  cm: styles.tokCm, op: styles.tokOp, nm: styles.tokNm,
}

function CodeCard() {
  const handleClick = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <motion.div
      className={styles.codeCard}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
      whileHover={{ y: -3, scale: 1.015 }}
      role="button"
      tabIndex={0}
      aria-label="View our services"
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className={styles.codeHeader}>
        <span className={styles.codeDot} style={{ background: 'rgba(255,100,100,0.6)' }} />
        <span className={styles.codeDot} style={{ background: 'rgba(255,200,80,0.6)' }} />
        <span className={styles.codeDot} style={{ background: 'rgba(100,220,100,0.6)' }} />
        <span className={styles.codeFileName}>analysis.py</span>
      </div>
      <div className={styles.codeBody}>
        {CODE.map((line, i) => (
          <motion.div
            key={i}
            className={styles.codeLine}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 + i * 0.09, duration: 0.4 }}
          >
            <span className={styles.lineNum}>{i + 1}</span>
            {line.map((tok, j) => (
              <span key={j} className={TOK[tok.c]}>{tok.t}</span>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface GridOverlayProps {
  top?: number
  bottom?: number
}

export function GridOverlay({ top = 120, bottom = 0 }: GridOverlayProps) {
  const [activeCell, setActiveCell] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        const key = PULSE_KEYS[Math.floor(Math.random() * PULSE_KEYS.length)]
        setActiveCell(key)
        setTimeout(() => { setActiveCell(null); schedule() }, 650)
      }, 1400 + Math.random() * 800)
    }
    schedule()
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <div className={styles.wrap} style={{ bottom }} aria-hidden>
      <div className={styles.content} style={{ paddingTop: top }}>

        <div className={styles.grid}>
          {COLS.map((col, ci) => (
            <motion.div
              key={ci}
              className={styles.col}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + (COLS.length - 1 - ci) * 0.07, duration: 0.9, ease: 'easeOut' }}
            >
              <div className={styles.header}>
                {col && <span className={styles.colLabel}>{col}</span>}
              </div>

              {Array.from({ length: ROW_COUNT }, (_, ri) => {
                const row = ri + 1
                const key = `${ci}-${row}`
                const isActive  = key === activeCell
                const isHeader  = HEADER_KEYS.has(key)
                const isTotal   = TOTAL_KEYS.has(key)
                const isCenter  = CENTER_COLS.has(ci)
                const isDelta   = DELTA_KEYS.has(key)
                const value     = ci > 0 ? DATA[key] : null
                // Sequential pulse index: row-by-row, left to right
                const pulseIdx  = ri * COLS.length + ci

                return (
                  <div
                    key={row}
                    className={[
                      styles.cell,
                      isActive  ? styles.active      : '',
                      isHeader  ? styles.cellHeader  : '',
                      isTotal   ? styles.cellTotal   : '',
                      isCenter  ? styles.cellCenter  : '',
                      row === ROW_COUNT - 1 ? styles.cellPreTotal : '',
                    ].join(' ')}
                    style={{ '--pi': pulseIdx } as React.CSSProperties}
                    onMouseEnter={() => setActiveCell(key)}
                    onMouseLeave={() => setActiveCell(null)}
                  >
                    {ci === 0 ? (
                      <span className={styles.rowNum}>{row}</span>
                    ) : value ? (
                      <span className={[
                        styles.value,
                        isActive  ? styles.valueActive  : '',
                        isHeader  ? styles.valueHeader  : '',
                        isTotal   ? styles.valueTotal   : '',
                        isDelta   ? styles.valueDelta   : '',
                      ].join(' ')}>
                        {value}
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </motion.div>
          ))}
        </div>

        <div className={styles.cardsRow}>
          <DashCard />
          <CodeCard />
        </div>

      </div>
    </div>
  )
}
