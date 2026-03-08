import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown } from 'lucide-react'

export default function Hero() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-text]', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.3,
      })
      gsap.from('[data-hero-cta]', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1,
      })
      gsap.from('[data-hero-arrow]', {
        y: -10,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.4,
      })
      gsap.to('[data-hero-arrow]', {
        y: 8,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2.2,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex items-end overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1920&q=80)',
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, #1A1A1A 0%, rgba(26,26,26,0.6) 50%, rgba(46,64,54,0.2) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-24 md:pb-32">
        <div className="max-w-3xl">
          <p
            data-hero-text
            className="text-cream/60 text-sm font-mono uppercase mb-6"
            style={{ letterSpacing: '0.3em' }}
          >
            Precision Wellness Intelligence
          </p>
          <h1 data-hero-text className="mb-6">
            <span className="block text-cream text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight"
              style={{ lineHeight: 0.95 }}
            >
              Nature is the
            </span>
            <span
              className="block text-cream text-6xl md:text-8xl font-serif italic mt-2"
              style={{ lineHeight: 0.9, fontSize: 'clamp(3.75rem, 8vw, 9rem)' }}
            >
              Algorithm.
            </span>
          </h1>
          <p
            data-hero-text
            className="text-cream/70 text-lg md:text-xl max-w-lg leading-relaxed font-light"
          >
            Biological data meets clinical intelligence. A protocol built
            around your body&apos;s own signals.
          </p>
          <div data-hero-cta className="mt-10 flex items-center gap-6">
            <a
              href="#features"
              className="group relative inline-flex items-center gap-3 bg-clay text-cream px-8 py-4 rounded-full text-sm font-semibold overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <span className="relative z-10">Explore Protocol</span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>
            <a
              href="#philosophy"
              className="text-cream/60 text-sm font-medium hover:text-cream transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        <div
          data-hero-arrow
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/40"
        >
          <ArrowDown size={20} />
        </div>
      </div>
    </section>
  )
}
