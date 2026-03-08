import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function HelixArtifact() {
  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32" style={{ color: 'rgba(46,64,54,0.2)' }}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const y = 20 + i * 22
        const xA = 70 + Math.sin(i * 0.8) * 40
        const xB = 130 - Math.sin(i * 0.8) * 40
        return (
          <g key={i}>
            <line x1={xA} y1={y} x2={xB} y2={y} stroke="currentColor" strokeWidth="0.5" opacity={0.3} />
            <circle cx={xA} cy={y} r="3" fill="currentColor">
              <animate attributeName="cx" values={`${xA};${xB};${xA}`} dur="4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={xB} cy={y} r="3" fill="currentColor" opacity={0.4}>
              <animate attributeName="cx" values={`${xB};${xA};${xB}`} dur="4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        )
      })}
    </svg>
  )
}

function LaserGridArtifact() {
  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <g key={i}>
          <line x1={20 + i * 20} y1="20" x2={20 + i * 20} y2="180" stroke="#2E4036" strokeWidth="0.3" opacity="0.15" />
          <line x1="20" y1={20 + i * 20} x2="180" y2={20 + i * 20} stroke="#2E4036" strokeWidth="0.3" opacity="0.15" />
        </g>
      ))}
      <line x1="20" y1="20" x2="180" y2="20" stroke="#CC5833" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="y1" values="20;180;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;180;20" dur="3s" repeatCount="indefinite" />
      </line>
    </svg>
  )
}

function EKGArtifact() {
  const path = 'M0,100 L30,100 L40,100 L45,60 L50,140 L55,30 L60,120 L65,90 L70,100 L130,100 L140,100 L145,60 L150,140 L155,30 L160,120 L165,90 L170,100 L200,100'
  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32">
      <path d={path} fill="none" stroke="#CC5833" strokeWidth="2" opacity="0.5" strokeLinecap="round" strokeDasharray="400" strokeDashoffset="400">
        <animate attributeName="stroke-dashoffset" values="400;0;400" dur="3s" repeatCount="indefinite" />
      </path>
      <path d={path} fill="none" stroke="#2E4036" strokeWidth="0.5" opacity="0.15" />
    </svg>
  )
}

const protocols = [
  {
    step: '01',
    title: 'Biological Intake',
    subtitle: 'Data Acquisition Layer',
    desc: 'We begin with a comprehensive mapping of your biomarkers — cortisol curves, inflammatory markers, microbiome composition, and sleep architecture. No assumptions. Just your biology, raw and unfiltered.',
    Artifact: HelixArtifact,
    bg: '#F2F0E9',
  },
  {
    step: '02',
    title: 'Signal Processing',
    subtitle: 'Pattern Recognition Engine',
    desc: 'Our neural engine cross-references your data against thousands of wellness patterns. It identifies what a human clinician would miss — the micro-oscillations, the lagging indicators, the hidden correlations.',
    Artifact: LaserGridArtifact,
    bg: '#ffffff',
  },
  {
    step: '03',
    title: 'Protocol Synthesis',
    subtitle: 'Adaptive Output Layer',
    desc: "The final output isn't a recommendation — it's a living protocol. It adjusts weekly, recalibrating as your body changes. Each iteration is sharper, more attuned, more precisely yours.",
    Artifact: EKGArtifact,
    bg: '#F2F0E9',
  },
]

export default function Protocol() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (i < cardsRef.current.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
            onUpdate: (self) => {
              const progress = self.progress
              gsap.to(card, {
                scale: 1 - progress * 0.1,
                filter: `blur(${progress * 20}px)`,
                opacity: 1 - progress * 0.5,
                duration: 0.1,
                overwrite: true,
              })
            },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="protocol" ref={sectionRef}>
      <div className="h-screen flex items-center justify-center bg-cream">
        <div className="text-center px-6">
          <p
            className="text-xs font-mono text-clay uppercase mb-4"
            style={{ letterSpacing: '0.3em' }}
          >
            The Protocol
          </p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-charcoal tracking-tight">
            Three Phases.
            <br />
            <span className="font-serif italic text-moss">Zero Guesswork.</span>
          </h2>
        </div>
      </div>

      {protocols.map((proto, i) => (
        <div
          key={proto.step}
          ref={(el) => (cardsRef.current[i] = el)}
          className="relative h-screen flex items-center"
          style={{ zIndex: 10 + i, backgroundColor: proto.bg }}
        >
          <div className="w-full max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span
                className="text-7xl md:text-9xl font-heading font-extrabold"
                style={{ color: 'rgba(46,64,54,0.08)' }}
              >
                {proto.step}
              </span>
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-charcoal tracking-tight -mt-6">
                {proto.title}
              </h3>
              <p className="text-xs font-mono text-clay tracking-wider uppercase mt-3 mb-6">
                {proto.subtitle}
              </p>
              <p className="text-charcoal/60 text-lg leading-relaxed max-w-md">
                {proto.desc}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div
                className="w-64 h-64 rounded-[3rem] flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(46,64,54,0.05)',
                }}
              >
                <proto.Artifact />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
