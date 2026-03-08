import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Philosophy() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('[data-parallax-texture]', {
        yPercent: -15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      const lines = sectionRef.current.querySelectorAll('[data-reveal-line]')
      lines.forEach((line) => {
        const chars = line.querySelectorAll('span')
        gsap.from(chars, {
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
          },
          y: 60,
          opacity: 0,
          rotateX: -40,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
        })
      })

      gsap.from('[data-philosophy-body]', {
        scrollTrigger: {
          trigger: '[data-philosophy-body]',
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const splitChars = (text) =>
    text.split('').map((char, i) => (
      <span
        key={i}
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative py-40 px-6 md:px-8 bg-charcoal overflow-hidden"
    >
      <div
        data-parallax-texture
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80)',
          transform: 'scale(1.2)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <p
          className="text-xs font-mono text-clay uppercase mb-16"
          style={{ letterSpacing: '0.3em' }}
        >
          The Manifesto
        </p>

        <div className="space-y-4 mb-16">
          <h2
            data-reveal-line
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-cream/30 tracking-tight leading-tight"
          >
            {splitChars('What is wrong?')}
          </h2>
          <h2
            data-reveal-line
            className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-cream tracking-tight leading-tight"
          >
            {splitChars('What is optimal.')}
          </h2>
        </div>

        <div data-philosophy-body className="max-w-2xl">
          <p className="text-cream/50 text-lg md:text-xl leading-relaxed mb-8">
            Modern medicine asks the wrong question. It waits for breakdown, then reacts.
            We&apos;ve inverted the paradigm — Nura reads your biology in real time,
            finding the signal in the noise, the pattern in the chaos.
          </p>
          <p className="text-cream/30 text-base leading-relaxed">
            Every metric, every rhythm, every fluctuation tells a story.
            Our protocol doesn&apos;t just listen — it{' '}
            <span className="text-clay italic font-serif text-lg">understands.</span>
          </p>
        </div>

        <div
          className="mt-20 h-px"
          style={{
            background:
              'linear-gradient(to right, rgba(46,64,54,0.4), rgba(204,88,51,0.2), transparent)',
          }}
        />
      </div>
    </section>
  )
}
