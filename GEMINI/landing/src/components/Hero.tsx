import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[100dvh] flex items-end justify-start p-8 md:p-16 lg:p-24 overflow-hidden">
      {/* Background Image & Gradient */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=3400&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-moss via-moss/80 to-charcoal/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl text-white">
        <h1 className="flex flex-col gap-2">
          <span className="hero-text font-sans font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight text-white">
            Nature is the
          </span>
          <span className="hero-text font-serif italic text-6xl md:text-8xl lg:text-9xl text-cream drop-shadow-lg">
            Algorithm.
          </span>
        </h1>
        <p className="hero-text mt-8 max-w-lg text-lg md:text-xl text-cream/80 font-medium leading-relaxed">
          Pioneering a new era of high-end organic tech. 
          Bridging the gap between biological research and precision telemetry.
        </p>
      </div>
    </section>
  );
};

export default Hero;