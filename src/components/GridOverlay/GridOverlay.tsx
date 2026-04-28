import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './GridOverlay.module.css'

// ─── Excel grid ───────────────────────────────────────────────────────────────

const COLS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const ROW_COUNT = 14

const DATA: Record<string, string> = {
  '1-1': 'Year',  '2-1': 'Qtr',  '3-1': 'Month', '4-1': 'Sales',  '5-1': 'Costs',  '6-1': 'GM%',
  '1-2': '2024',  '2-2': 'Q1',   '3-2': 'Jan',   '4-2': '18.5k',  '5-2': '13.0k',  '6-2': '29.7%',
  '1-3': '2024',  '2-3': 'Q1',   '3-3': 'Feb',   '4-3': '16.0k',  '5-3': '11.4k',  '6-3': '28.7%',
  '1-4': '2024',  '2-4': 'Q1',   '3-4': 'Mar',   '4-4': '22.5k',  '5-4': '15.3k',  '6-4': '32.0%',
  '1-5': '2024',  '2-5': 'Q2',   '3-5': 'Apr',   '4-5': '24.8k',  '5-5': '16.6k',  '6-5': '33.1%',
  '1-6': '2024',  '2-6': 'Q2',   '3-6': 'May',   '4-6': '26.5k',  '5-6': '17.5k',  '6-6': '34.0%',
  '1-7': '2024',  '2-7': 'Q2',   '3-7': 'Jun',   '4-7': '28.0k',  '5-7': '18.2k',  '6-7': '35.0%',
  '1-8': '2024',  '2-8': 'Q3',   '3-8': 'Jul',   '4-8': '25.5k',  '5-8': '16.8k',  '6-8': '34.1%',
  '1-9': '2024',  '2-9': 'Q3',   '3-9': 'Aug',   '4-9': '23.5k',  '5-9': '15.5k',  '6-9': '34.0%',
  '1-10': '2024', '2-10': 'Q3',  '3-10': 'Sep',  '4-10': '30.0k', '5-10': '19.5k', '6-10': '35.0%',
  '1-11': '2024', '2-11': 'Q4',  '3-11': 'Oct',  '4-11': '31.5k', '5-11': '20.2k', '6-11': '35.9%',
  '1-12': '2024', '2-12': 'Q4',  '3-12': 'Nov',  '4-12': '33.0k', '5-12': '20.9k', '6-12': '36.7%',
  '1-13': '2024', '2-13': 'Q4',  '3-13': 'Dec',  '4-13': '36.0k', '5-13': '22.3k', '6-13': '38.1%',
  '1-14': 'Total',                                 '4-14': '315.8k','5-14': '207.2k','6-14': '34.4%',
}

const PULSE_KEYS = Array.from({ length: 12 }, (_, i) =>
  [`4-${i + 2}`, `5-${i + 2}`, `6-${i + 2}`]
).flat()

const HEADER_KEYS = new Set(['1-1','2-1','3-1','4-1','5-1','6-1'])
const TOTAL_KEYS  = new Set(['1-14','4-14','5-14','6-14'])
const CENTER_COLS = new Set([1, 2, 3])

// ─── Dashboard card ───────────────────────────────────────────────────────────

// Heights normalised to Dec max (36.0k → 100)
const MONTHLY_BARS = [
  { h: 51,  label: 'J' }, // Jan 18.5k
  { h: 44,  label: 'F' }, // Feb 16.0k
  { h: 63,  label: 'M' }, // Mar 22.5k
  { h: 69,  label: 'A' }, // Apr 24.8k
  { h: 74,  label: 'M' }, // May 26.5k
  { h: 78,  label: 'J' }, // Jun 28.0k
  { h: 71,  label: 'J' }, // Jul 25.5k
  { h: 65,  label: 'A' }, // Aug 23.5k
  { h: 83,  label: 'S' }, // Sep 30.0k
  { h: 88,  label: 'O' }, // Oct 31.5k
  { h: 92,  label: 'N' }, // Nov 33.0k
  { h: 100, label: 'D' }, // Dec 36.0k — peak
]

function DashCard() {
  return (
    <motion.div
      className={styles.dashCard}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.dashHeader}>
        <span className={styles.dashDot} />
        <span className={styles.dashTitle}>Sales 2024</span>
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

// ─── Python code card ─────────────────────────────────────────────────────────

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
  return (
    <motion.div
      className={styles.codeCard}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
      }, 1600 + Math.random() * 900)
    }
    schedule()
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <div className={styles.wrap} style={{ bottom }} aria-hidden>
      <div className={styles.content} style={{ paddingTop: top }}>

        {/* Excel grid */}
        <div className={styles.grid}>
          {COLS.map((col, ci) => (
            <motion.div
              key={ci}
              className={styles.col}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.4 + (COLS.length - 1 - ci) * 0.07,
                duration: 0.9,
                ease: 'easeOut',
              }}
            >
              <div className={styles.header}>
                {col && <span className={styles.colLabel}>{col}</span>}
              </div>

              {Array.from({ length: ROW_COUNT }, (_, ri) => {
                const row = ri + 1
                const key = `${ci}-${row}`
                const isActive = key === activeCell
                const isHeader = HEADER_KEYS.has(key)
                const isTotal  = TOTAL_KEYS.has(key)
                const isCenter = CENTER_COLS.has(ci)
                const value = ci > 0 ? DATA[key] : null

                return (
                  <div
                    key={row}
                    className={[
                      styles.cell,
                      isActive ? styles.active : '',
                      isHeader ? styles.cellHeader : '',
                      isTotal  ? styles.cellTotal  : '',
                      isCenter ? styles.cellCenter : '',
                      row === ROW_COUNT - 1 ? styles.cellPreTotal : '',
                    ].join(' ')}
                    onMouseEnter={() => setActiveCell(key)}
                    onMouseLeave={() => setActiveCell(null)}
                  >
                    {ci === 0 ? (
                      <span className={styles.rowNum}>{row}</span>
                    ) : value ? (
                      <span className={[
                        styles.value,
                        isActive ? styles.valueActive : '',
                        isHeader ? styles.valueHeader : '',
                        isTotal  ? styles.valueTotal  : '',
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

        {/* Dashboard + code cards */}
        <div className={styles.cardsRow}>
          <DashCard />
          <CodeCard />
        </div>

      </div>
    </div>
  )
}
