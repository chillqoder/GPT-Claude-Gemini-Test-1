import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Activity, Brain, Calendar } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ── Card 1: Diagnostic Shuffler ── */
function AuditCard() {
  const [cards, setCards] = useState([
    { id: 1, title: 'Cortisol Mapping', value: '92%', status: 'Optimal' },
    { id: 2, title: 'Sleep Architecture', value: '7.4h', status: 'Review' },
    { id: 3, title: 'HRV Baseline', value: '68ms', status: 'Tracking' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const arr = [...prev]
        arr.unshift(arr.pop())
        return arr
      })
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative mt-6" style={{ height: '13rem' }}>
      {cards.map((card, i) => (
        <div
          key={card.id}
          className="absolute inset-x-0 bg-white rounded-2xl p-5 shadow-sm"
          style={{
            top: `${i * 12}px`,
            zIndex: 3 - i,
            opacity: 1 - i * 0.2,
            transform: `scale(${1 - i * 0.04})`,
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            border: '1px solid rgba(46,64,54,0.05)',
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-moss/50 uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-3xl font-heading font-bold text-charcoal mt-1">
                {card.value}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                card.status === 'Optimal'
                  ? 'bg-moss/10 text-moss'
                  : card.status === 'Review'
                  ? 'bg-clay/10 text-clay'
                  : 'bg-charcoal/5 text-charcoal/60'
              }`}
            >
              {card.status}
            </span>
          </div>
          <div className="mt-4 h-1.5 bg-cream rounded-full overflow-hidden">
            <div
              className="h-full bg-moss rounded-full transition-all duration-1000"
              style={{ width: `${70 + card.id * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Card 2: Telemetry Typewriter ── */
function NeuralStreamCard() {
  const messages = [
    'Optimizing Circadian Rhythm...',
    'Recalibrating Stress Response...',
    'Mapping Neurotransmitter Flux...',
    'Syncing Biometric Telemetry...',
    'Analyzing Cortisol Gradients...',
    'Evaluating Sleep Debt Protocol...',
  ]
  const [currentMsg, setCurrentMsg] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const cursorBlink = setInterval(() => setShowCursor((v) => !v), 530)
    return () => clearInterval(cursorBlink)
  }, [])

  useEffect(() => {
    const msg = messages[currentMsg]
    let charIdx = 0
    setDisplayText('')

    const typeInterval = setInterval(() => {
      if (charIdx <= msg.length) {
        setDisplayText(msg.slice(0, charIdx))
        charIdx++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setCurrentMsg((prev) => (prev + 1) % messages.length)
        }, 1800)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [currentMsg])

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-clay" />
        </span>
        <span className="text-xs font-mono text-moss/50 uppercase tracking-wider">
          Neural Stream Active
        </span>
      </div>

      <div className="bg-charcoal rounded-xl p-4 font-mono text-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-clay/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-moss/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-moss/20" />
        </div>
        <p className="text-cream/80 leading-relaxed">
          <span className="text-clay">{'>'}</span> {displayText}
          <span
            className="inline-block w-2 h-4 ml-0.5 -mb-0.5 transition-opacity"
            style={{
              backgroundColor: showCursor ? '#CC5833' : 'transparent',
            }}
          />
        </p>
        <div className="mt-3 pt-3 border-t border-white/5 text-cream/30 text-xs">
          {messages
            .slice(0, currentMsg)
            .slice(-2)
            .map((m, i) => (
              <p key={i} className="mb-1">
                <span className="text-moss/60">✓</span> {m}
              </p>
            ))}
        </div>
      </div>
    </div>
  )
}

/* ── Card 3: Protocol Scheduler ── */
function AdaptiveRegimenCard() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const protocols = [
    [1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 0, 1],
  ]
  const labels = ['Neuro', 'Recovery', 'Metabolic']
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCell((prev) => {
        let nextCol = prev.col + 1
        let nextRow = prev.row
        if (nextCol >= 7) {
          nextCol = 0
          nextRow = (nextRow + 1) % 3
        }
        return { row: nextRow, col: nextCol }
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-6">
      <div
        className="bg-white rounded-xl p-5"
        style={{ border: '1px solid rgba(46,64,54,0.05)' }}
      >
        <div className="grid grid-cols-8 gap-2 mb-3">
          <div />
          {days.map((d, i) => (
            <div key={i} className="text-center text-xs font-mono text-moss/40">
              {d}
            </div>
          ))}
        </div>

        {protocols.map((row, ri) => (
          <div key={ri} className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-xs font-mono text-moss/60 flex items-center">
              {labels[ri]}
            </div>
            {row.map((active, ci) => {
              const isTarget = activeCell.row === ri && activeCell.col === ci
              return (
                <div
                  key={ci}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-500 ${
                    isTarget
                      ? 'bg-clay scale-110 shadow-lg'
                      : active
                      ? 'bg-moss/[0.15]'
                      : 'bg-cream'
                  }`}
                  style={isTarget ? { boxShadow: '0 10px 15px -3px rgba(204,88,51,0.2)' } : {}}
                >
                  {active && !isTarget && (
                    <div className="w-1.5 h-1.5 rounded-full bg-moss/40" />
                  )}
                  {isTarget && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              )
            })}
          </div>
        ))}

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="font-mono text-moss/40">Protocol auto-assigned</span>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="text-clay">
              <path d="M1 1L13 8L7 9.5L5 17L1 1Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
            </svg>
            <span className="text-clay font-medium">nura-ai</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Features Section ── */
export default function Features() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-feature-card]', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: Brain,
      tag: 'Audit Intelligence',
      title: 'Diagnostic Engine',
      desc: 'Multi-layered health audit that surfaces what matters, not what is obvious.',
      Component: AuditCard,
    },
    {
      icon: Activity,
      tag: 'Neural Stream',
      title: 'Live Telemetry',
      desc: 'Real-time processing of biometric signals into actionable protocol adjustments.',
      Component: NeuralStreamCard,
    },
    {
      icon: Calendar,
      tag: 'Adaptive Regimen',
      title: 'Protocol Scheduler',
      desc: 'Autonomously assigns weekly protocols calibrated to your biological rhythms.',
      Component: AdaptiveRegimenCard,
    },
  ]

  return (
    <section id="features" ref={sectionRef} className="py-32 px-6 md:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p
            className="text-xs font-mono text-clay uppercase mb-4"
            style={{ letterSpacing: '0.3em' }}
          >
            System Architecture
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal tracking-tight">
            Precision Micro-UI
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, tag, title, desc, Component }) => (
            <div
              key={tag}
              data-feature-card
              className="bg-cream rounded-[2rem] p-8 transition-colors duration-500"
              style={{ border: '1px solid rgba(46,64,54,0.08)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(46,64,54,0.08)' }}
                >
                  <Icon size={18} className="text-moss" />
                </div>
                <span className="text-xs font-mono text-moss/50 tracking-wider uppercase">
                  {tag}
                </span>
              </div>
              <h3 className="text-xl font-heading font-bold text-charcoal mb-2">
                {title}
              </h3>
              <p className="text-sm text-charcoal/60 leading-relaxed">{desc}</p>
              <Component />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
