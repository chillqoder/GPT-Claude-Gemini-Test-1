import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const tiers = [
  {
    name: 'Baseline',
    price: '49',
    period: '/month',
    desc: 'Essential biometric tracking and monthly protocol reviews.',
    features: [
      'Core biomarker tracking',
      'Monthly protocol update',
      'Sleep architecture analysis',
      'Community access',
    ],
    featured: false,
  },
  {
    name: 'Performance',
    price: '149',
    period: '/month',
    desc: 'Full neural stream access with weekly adaptive protocols.',
    features: [
      'Everything in Baseline',
      'Real-time telemetry stream',
      'Weekly protocol adaptation',
      'HRV & cortisol mapping',
      '1:1 clinical consult / month',
      'Priority neural processing',
    ],
    featured: true,
  },
  {
    name: 'Clinical',
    price: '399',
    period: '/month',
    desc: 'White-glove protocol design with dedicated clinical oversight.',
    features: [
      'Everything in Performance',
      'Dedicated protocol architect',
      'Daily protocol adjustments',
      'Advanced microbiome analysis',
      'Genomic integration',
      'Concierge health team',
    ],
    featured: false,
  },
]

export default function Membership() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-pricing-card]', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="membership" ref={sectionRef} className="py-32 px-6 md:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p
            className="text-xs font-mono text-clay uppercase mb-4"
            style={{ letterSpacing: '0.3em' }}
          >
            Membership
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal tracking-tight">
            Choose Your Protocol
          </h2>
          <p className="mt-4 text-charcoal/50 text-lg max-w-md mx-auto">
            Every tier includes our core intelligence engine. Scale the depth of your biological insight.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              data-pricing-card
              className={`rounded-[2rem] p-8 transition-all duration-500 ${
                tier.featured
                  ? 'bg-moss text-cream scale-[1.02]'
                  : 'bg-white text-charcoal'
              }`}
              style={
                tier.featured
                  ? { boxShadow: '0 25px 50px -12px rgba(46,64,54,0.2)' }
                  : { border: '1px solid rgba(46,64,54,0.08)' }
              }
            >
              <p
                className={`text-xs font-mono tracking-wider uppercase mb-4 ${
                  tier.featured ? 'text-cream/60' : 'text-moss/50'
                }`}
              >
                {tier.name}
              </p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-heading font-bold">${tier.price}</span>
                <span className={`text-sm ${tier.featured ? 'text-cream/50' : 'text-charcoal/40'}`}>
                  {tier.period}
                </span>
              </div>

              <p
                className={`text-sm leading-relaxed mb-8 ${
                  tier.featured ? 'text-cream/60' : 'text-charcoal/50'
                }`}
              >
                {tier.desc}
              </p>

              <button
                className={`w-full py-3.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  tier.featured
                    ? 'bg-clay text-cream hover:opacity-90'
                    : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10'
                }`}
              >
                Get Started
              </button>

              <div className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check
                      size={16}
                      className={`mt-0.5 flex-shrink-0 ${
                        tier.featured ? 'text-clay' : 'text-moss/40'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        tier.featured ? 'text-cream/80' : 'text-charcoal/60'
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
