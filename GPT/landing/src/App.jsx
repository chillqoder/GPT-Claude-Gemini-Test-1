import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Check,
  CircleDot,
  Leaf,
  Menu,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const auditCards = [
  { title: 'Metabolic drift', note: 'Recovered from wearable, HRV, and nutrient adherence.' },
  { title: 'Sleep architecture', note: 'Identified low REM continuity across three-night sample.' },
  { title: 'Inflammation signature', note: 'Flagged timing mismatch between output, recovery, and load.' },
]

const telemetryMessages = [
  'Optimizing circadian rhythm...',
  'Recalibrating inflammation baseline...',
  'Sequencing nutrient compliance...',
  'Validating performance recovery window...',
]

const protocols = [
  {
    index: '01',
    title: 'Signal Mapping',
    copy:
      'We build a living clinical model from bloodwork, wearable telemetry, symptom logging, and training load.',
    artifact: 'double-helix',
  },
  {
    index: '02',
    title: 'Regimen Design',
    copy:
      'Every intervention is staged, weighted, and re-tested against output, recovery, and biological stability.',
    artifact: 'laser-grid',
  },
  {
    index: '03',
    title: 'Adaptive Review',
    copy:
      'The protocol shifts with your physiology. We do not preserve plans. We preserve momentum toward optimal.',
    artifact: 'ekg',
  },
]

const pricingTiers = [
  {
    name: 'Foundational',
    price: '$480',
    meta: '/ month',
    description: 'Core diagnostics, protocol build, and monthly lab-informed review.',
    features: ['Quarterly bloodwork mapping', 'Wearable sync', 'Two physician notes'],
    featured: false,
  },
  {
    name: 'Performance',
    price: '$920',
    meta: '/ month',
    description: 'Adaptive health operations for high-output founders, athletes, and executives.',
    features: ['Continuous telemetry review', 'Weekly protocol refinements', 'Priority clinical messaging'],
    featured: true,
  },
  {
    name: 'Sovereign',
    price: '$1,650',
    meta: '/ month',
    description: 'White-glove longevity architecture with concierge escalation across specialists.',
    features: ['Private biomarker dashboard', 'Travel protocol design', 'Rapid specialist coordination'],
    featured: false,
  },
]

function splitText(text) {
  return text.split(' ').map((word, index) => (
    <span key={`${word}-${index}`} className="inline-block overflow-hidden pr-[0.18em]">
      <span className="split-word inline-block">{word}</span>
    </span>
  ))
}

function ProtocolArtifact({ type }) {
  if (type === 'double-helix') {
    return (
      <div className="relative h-44 w-44">
        <div className="absolute inset-0 animate-drift rounded-full border border-white/20" />
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <path d="M70 20 C120 50, 80 90, 130 120 S110 180, 70 180" fill="none" stroke="#CC5833" strokeWidth="3" />
          <path d="M130 20 C80 50, 120 90, 70 120 S90 180, 130 180" fill="none" stroke="#F2F0E9" strokeWidth="3" />
          {[40, 70, 100, 130, 160].map((y) => (
            <line key={y} x1="82" x2="118" y1={y} y2={y} stroke="#8FA296" strokeWidth="2" />
          ))}
        </svg>
      </div>
    )
  }

  if (type === 'laser-grid') {
    return (
      <div className="relative h-44 w-44 overflow-hidden rounded-[2rem] border border-white/15 bg-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(242,240,233,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(242,240,233,0.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-clay/70 shadow-[0_0_25px_rgba(204,88,51,0.95)]" />
      </div>
    )
  }

  return (
    <div className="relative h-44 w-52 overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 px-4 py-6">
      <svg viewBox="0 0 220 120" className="h-full w-full">
        <path
          d="M0 65 C15 65, 15 30, 30 30 S45 95, 60 95 S75 40, 90 40 S105 85, 120 85 S135 55, 150 55 S165 75, 180 75 S195 45, 220 45"
          fill="none"
          stroke="#CC5833"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function App() {
  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const manifestoRef = useRef(null)
  const protocolRef = useRef(null)
  const schedulerCursorRef = useRef(null)
  const magneticRefs = useRef([])
  const [navOpen, setNavOpen] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [activeAuditCard, setActiveAuditCard] = useState(0)
  const [telemetryIndex, setTelemetryIndex] = useState(0)
  const [schedulerStep, setSchedulerStep] = useState(0)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveAuditCard((current) => (current + 1) % auditCards.length)
    }, 2600)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTelemetryIndex((current) => (current + 1) % telemetryMessages.length)
    }, 2200)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSchedulerStep((current) => (current + 1) % 6)
    }, 1600)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const cursor = schedulerCursorRef.current
    if (!cursor) return

    const positions = [
      { x: 18, y: 18 },
      { x: 112, y: 18 },
      { x: 206, y: 54 },
      { x: 52, y: 92 },
      { x: 156, y: 92 },
      { x: 240, y: 130 },
    ]
    const target = positions[schedulerStep]
    gsap.to(cursor, {
      x: target.x,
      y: target.y,
      duration: 0.9,
      ease: 'power3.inOut',
      scale: 1,
    })
    gsap.fromTo(
      cursor,
      { scale: 0.86 },
      { scale: 1.04, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.out' },
    )
  }, [schedulerStep])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-item]', {
        y: 42,
        opacity: 0,
        duration: 1.15,
        stagger: 0.14,
        ease: 'power3.out',
      })

      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 78%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.16,
        ease: 'power3.out',
      })

      gsap.fromTo(
        '.split-word',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: 'top 70%',
          },
        },
      )

      const protocolCards = gsap.utils.toArray('.protocol-card')

      protocolCards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top top+=90',
          end: 'bottom top+=90',
          pin: true,
          pinSpacing: index === protocolCards.length - 1,
          scrub: true,
          onUpdate: (self) => {
            const previous = protocolRef.current?.querySelectorAll('.protocol-card')[index - 1]
            if (previous) {
              gsap.to(previous, {
                scale: 0.9 + (1 - self.progress) * 0.1,
                opacity: 0.5 + (1 - self.progress) * 0.5,
                filter: `blur(${20 * self.progress}px)`,
                duration: 0.1,
                overwrite: true,
              })
            }
          },
        })
      })

      gsap.to('.texture-parallax', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const buttons = magneticRefs.current.filter(Boolean)
    const cleanups = buttons.map((button) => {
      const label = button.querySelector('[data-magnetic-label]')
      const handleMove = (event) => {
        const rect = button.getBoundingClientRect()
        const x = event.clientX - rect.left - rect.width / 2
        const y = event.clientY - rect.top - rect.height / 2
        gsap.to(button, { x: x * 0.12, y: y * 0.18, duration: 0.35, ease: 'power2.out' })
        if (label) {
          gsap.to(label, { x: x * 0.06, y: y * 0.08, duration: 0.35, ease: 'power2.out' })
        }
      }
      const handleLeave = () => {
        gsap.to([button, label], { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)' })
      }
      button.addEventListener('pointermove', handleMove)
      button.addEventListener('pointerleave', handleLeave)
      return () => {
        button.removeEventListener('pointermove', handleMove)
        button.removeEventListener('pointerleave', handleLeave)
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])

  return (
    <div ref={rootRef} className="overflow-x-hidden text-charcoal">
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8">
        <div
          className={[
            'mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-500 md:px-6',
            navScrolled
              ? 'border-moss/10 bg-white/60 text-moss shadow-panel backdrop-blur-xl'
              : 'border-white/10 bg-white/5 text-white backdrop-blur-sm',
          ].join(' ')}
        >
          <a href="#top" className="font-display text-lg font-semibold tracking-[0.18em] uppercase">
            Nura
          </a>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#features">Capabilities</a>
            <a href="#philosophy">Manifesto</a>
            <a href="#protocol">Protocol</a>
            <a href="#membership">Membership</a>
          </nav>
          <div className="hidden md:block">
            <MagneticButton refSetter={(node) => (magneticRefs.current[0] = node)} label="Request Access" />
          </div>
          <button className="md:hidden" onClick={() => setNavOpen((open) => !open)} aria-label="Toggle menu">
            <Menu size={20} />
          </button>
        </div>
        {navOpen ? (
          <div className="mx-auto mt-3 max-w-7xl rounded-[2rem] border border-moss/10 bg-white/85 p-4 text-moss shadow-panel backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-4 text-sm">
              <a href="#features" onClick={() => setNavOpen(false)}>Capabilities</a>
              <a href="#philosophy" onClick={() => setNavOpen(false)}>Manifesto</a>
              <a href="#protocol" onClick={() => setNavOpen(false)}>Protocol</a>
              <a href="#membership" onClick={() => setNavOpen(false)}>Membership</a>
            </div>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section
          ref={heroRef}
          className="relative flex min-h-[100dvh] items-end overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pb-14"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(46,64,54,0.08), rgba(0,0,0,0.68)), url('https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(46,64,54,0.14),_transparent_32%),linear-gradient(180deg,rgba(10,10,10,0)_35%,rgba(10,10,10,0.88)_100%)]" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.65fr] lg:items-end">
            <div className="max-w-4xl text-cream">
              <div data-hero-item className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-clay animate-pulseSoft" />
                Clinical Performance System
              </div>
              <h1 data-hero-item className="max-w-4xl text-balance text-5xl font-extrabold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[7rem]">
                <span className="font-display">Nature is the</span>{' '}
                <span className="font-serif text-[1.18em] font-medium italic">Algorithm.</span>
              </h1>
              <p data-hero-item className="mt-6 max-w-xl text-base leading-7 text-cream/78 md:text-lg">
                Nura translates biology into a living operating system: diagnostic intelligence, adaptive protocols,
                and clinical oversight designed to keep ambitious bodies in calibration.
              </p>
              <div data-hero-item className="mt-8 flex flex-col gap-4 sm:flex-row">
                <MagneticButton refSetter={(node) => (magneticRefs.current[1] = node)} label="Enter the System" light />
                <a
                  href="#features"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/18 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Instrument Panel
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <div data-hero-item className="justify-self-end">
              <div className="rounded-[2.6rem] border border-white/10 bg-white/10 p-5 text-cream shadow-panel backdrop-blur-xl md:p-6">
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.24em] text-cream/60">
                  <span>Live Cohort Signal</span>
                  <span>03.08.26</span>
                </div>
                <div className="mt-6 space-y-4">
                  <MetricRow label="Recovery Index" value="92.4" delta="+7.2%" />
                  <MetricRow label="Glucose Stability" value="0.91" delta="Optimal" />
                  <MetricRow label="Stress Load" value="18.2" delta="-12%" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-moss/60">Precision Micro-UI Dashboard</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-moss md:text-5xl">
                Boutique clinical intelligence, expressed as instruments.
              </h2>
            </div>
            <div className="features-grid grid gap-6 lg:grid-cols-3">
              <article className="feature-card rounded-[2.4rem] border border-moss/10 bg-white/75 p-6 shadow-panel backdrop-blur-sm">
                <FeatureHeader icon={ShieldCheck} title="Audit Intelligence" subtitle="Diagnostic Shuffler" />
                <div className="relative mt-8 h-72">
                  {auditCards.map((card, index) => {
                    const visualIndex = (index - activeAuditCard + auditCards.length) % auditCards.length

                    return (
                      <div
                        key={card.title}
                        className="absolute inset-x-0 rounded-[2rem] border border-moss/10 bg-white p-5 shadow-[0_20px_60px_rgba(46,64,54,0.12)] transition-all duration-700"
                        style={{
                          top: `${visualIndex * 22}px`,
                          transform: `scale(${1 - visualIndex * 0.04})`,
                          opacity: visualIndex > 2 ? 0 : 1,
                          zIndex: auditCards.length - visualIndex,
                          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs uppercase tracking-[0.24em] text-moss/50">
                            Signal {visualIndex + 1}
                          </span>
                          <CircleDot size={14} className="text-clay" />
                        </div>
                        <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-moss">{card.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-charcoal/70">{card.note}</p>
                      </div>
                    )
                  })}
                </div>
              </article>

              <article className="feature-card rounded-[2.4rem] border border-moss/10 bg-moss p-6 text-cream shadow-panel">
                <FeatureHeader icon={BrainCircuit} title="Neural Stream" subtitle="Telemetry Typewriter" dark />
                <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-cream/55">
                    <span className="h-2.5 w-2.5 rounded-full bg-clay animate-pulseSoft" />
                    Live adaptive feed
                  </div>
                  <div className="mt-8 min-h-20 font-mono text-lg text-cream">
                    {telemetryMessages[telemetryIndex]}
                    <span className="ml-1 inline-block h-6 w-3 bg-clay align-middle animate-blink" />
                  </div>
                  <div className="mt-10 grid gap-3">
                    {['Inflammatory tone', 'Cortisol recovery', 'Hydration adherence'].map((item, index) => (
                      <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                        <span className="text-sm text-cream/70">{item}</span>
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-clay">
                          {index === 0 ? 'Stable' : index === 1 ? 'Rerouting' : 'Online'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className="feature-card rounded-[2.4rem] border border-moss/10 bg-white/75 p-6 shadow-panel backdrop-blur-sm">
                <FeatureHeader icon={Activity} title="Adaptive Regimen" subtitle="Protocol Scheduler" />
                <div className="relative mt-8 rounded-[2rem] border border-moss/10 bg-[#fbfaf6] p-4">
                  <div className="grid grid-cols-4 gap-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-moss/45">
                    {['Mon', 'Tue', 'Thu', 'Sat'].map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>
                  <div className="relative mt-4 grid grid-cols-4 gap-3">
                    {[
                      'Lab sync',
                      'Sleep reset',
                      'VO2 cycle',
                      'Travel prep',
                      'Peptide',
                      'Zone 2',
                      'Cold exposure',
                      'Deload',
                      'Focus stack',
                      'IV micronutrients',
                      'Mobility',
                      'Review',
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={[
                          'flex h-16 items-center justify-center rounded-2xl border text-center text-xs transition-colors',
                          schedulerStep === index % 6
                            ? 'border-clay/40 bg-clay/12 text-moss'
                            : 'border-moss/10 bg-white text-charcoal/70',
                        ].join(' ')}
                      >
                        {item}
                      </div>
                    ))}
                    <div ref={schedulerCursorRef} className="pointer-events-none absolute left-0 top-0 h-6 w-6 text-moss">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full drop-shadow-[0_10px_18px_rgba(26,26,26,0.18)]">
                        <path d="M3 2 L18 13 L11 14 L14 22 L10.5 23 L7.5 15.2 L3 19 Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="philosophy" ref={manifestoRef} className="relative overflow-hidden bg-charcoal px-4 py-24 text-cream md:px-8 md:py-32">
          <div
            className="texture-parallax absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(26,26,26,0.72), rgba(26,26,26,0.92)), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1400&q=80')",
            }}
          />
          <div className="relative mx-auto max-w-7xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/45">The Manifesto</p>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="rounded-[2.6rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-cream/45">Legacy question</p>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
                  {splitText('What is wrong?')}
                </h2>
              </div>
              <div className="rounded-[2.6rem] border border-clay/20 bg-clay/10 p-8 backdrop-blur-sm">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">Nura question</p>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
                  {splitText('What is optimal?')}
                </h2>
              </div>
            </div>
            <p className="mt-10 max-w-3xl text-lg leading-8 text-cream/72">
              We are not here to merely resolve symptoms. We are here to increase range, compress recovery time, and
              design a physiology that can carry ambition without decay.
            </p>
          </div>
        </section>

        <section id="protocol" ref={protocolRef} className="bg-charcoal px-4 pb-12 pt-10 md:px-8 md:pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-cream">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/45">Sticky Stacking Archive</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">A protocol that moves as you move.</h2>
            </div>
            <div className="space-y-[10vh] pb-[30vh]">
              {protocols.map((protocol) => (
                <article
                  key={protocol.index}
                  className="protocol-card flex min-h-[84vh] items-center rounded-[3rem] border border-white/10 bg-[#202020] p-8 text-cream shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-12"
                >
                  <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_0.7fr] lg:items-center">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.28em] text-clay">{protocol.index}</p>
                      <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">{protocol.title}</h3>
                      <p className="mt-6 max-w-xl text-lg leading-8 text-cream/70">{protocol.copy}</p>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                      <ProtocolArtifact type={protocol.artifact} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="membership" className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-moss/60">Membership</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-moss md:text-5xl">
                Choose the level of clinical proximity your body requires.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {pricingTiers.map((tier, index) => (
                <article
                  key={tier.name}
                  className={[
                    'rounded-[2.6rem] border p-8 shadow-panel',
                    tier.featured ? 'border-moss bg-moss text-cream' : 'border-moss/10 bg-white/70 text-charcoal backdrop-blur-sm',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em]">{tier.name}</h3>
                      <p className={['mt-3 text-sm leading-6', tier.featured ? 'text-cream/72' : 'text-charcoal/65'].join(' ')}>
                        {tier.description}
                      </p>
                    </div>
                    {index === 1 ? <Sparkles size={18} className="text-clay" /> : null}
                  </div>
                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-5xl font-semibold tracking-[-0.06em]">{tier.price}</span>
                    <span className={tier.featured ? 'text-cream/60' : 'text-charcoal/55'}>{tier.meta}</span>
                  </div>
                  <div className="mt-8 space-y-4">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Check size={16} className={tier.featured ? 'text-clay' : 'text-moss'} />
                        <span className={tier.featured ? 'text-cream/78' : 'text-charcoal/72'}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#top"
                    className={[
                      'group mt-10 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-4 text-sm font-semibold transition',
                      tier.featured
                        ? 'bg-clay text-white hover:bg-[#b74c2b]'
                        : 'border border-moss/12 bg-white text-moss hover:bg-moss hover:text-cream',
                    ].join(' ')}
                  >
                    Apply for {tier.name}
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="rounded-t-[4rem] bg-charcoal px-4 py-10 text-cream md:px-8 md:py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.16em] uppercase">Nura Health</p>
            <p className="mt-3 max-w-md text-cream/64">
              Clinical systems for adaptive health, longer output, and biological precision.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] text-cream/65">
            <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-[#86d17c] align-middle animate-pulseSoft" />
            System Operational
          </div>
        </div>
      </footer>
    </div>
  )
}

function MetricRow({ label, value, delta }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/10 pb-4 last:border-b-0">
      <div>
        <p className="text-sm text-cream/68">{label}</p>
        <p className="mt-2 font-mono text-3xl tracking-[-0.05em] text-white">{value}</p>
      </div>
      <div className="self-center rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-clay">
        {delta}
      </div>
    </div>
  )
}

function FeatureHeader({ icon: Icon, title, subtitle, dark = false }) {
  return (
    <div>
      <div className={['inline-flex rounded-2xl p-3', dark ? 'bg-white/10 text-clay' : 'bg-moss/5 text-clay'].join(' ')}>
        <Icon size={20} />
      </div>
      <p className={['mt-4 font-mono text-xs uppercase tracking-[0.24em]', dark ? 'text-cream/45' : 'text-moss/48'].join(' ')}>
        {title}
      </p>
      <h3 className={['mt-3 text-3xl font-semibold tracking-[-0.05em]', dark ? 'text-cream' : 'text-moss'].join(' ')}>
        {subtitle}
      </h3>
    </div>
  )
}

function MagneticButton({ label, light = false, refSetter }) {
  return (
    <a
      href="#membership"
      ref={refSetter}
      className={[
        'group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-4 text-sm font-semibold transition-transform',
        light ? 'bg-cream text-moss' : 'bg-moss text-cream',
      ].join(' ')}
    >
      <span
        className={[
          'absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0',
          light ? 'bg-clay' : 'bg-clay',
        ].join(' ')}
      />
      <span data-magnetic-label className="relative z-10 flex items-center gap-2">
        <Leaf size={16} />
        {label}
      </span>
    </a>
  )
}

export default App
