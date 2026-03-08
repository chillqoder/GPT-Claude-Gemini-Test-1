import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Philosophy = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-text', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" ref={sectionRef} className="relative py-32 px-8 md:px-16 lg:px-24 bg-charcoal text-cream overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=3400&auto=format&fit=crop")' }}
      ></div>
      
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
        <div className="flex-1">
          <h2 className="reveal-text font-serif italic text-4xl md:text-5xl text-moss/50 mb-4">The shift.</h2>
          <div className="reveal-text font-sans font-bold text-3xl md:text-5xl leading-tight text-white/40 line-through decoration-clay/50 decoration-4">
            "What is wrong?"
          </div>
          <div className="reveal-text mt-4 font-sans font-bold text-4xl md:text-6xl leading-tight text-cream">
            "What is <span className="text-clay">optimal?</span>"
          </div>
        </div>
        
        <div className="flex-1">
          <p className="reveal-text text-lg text-cream/70 leading-relaxed font-outfit">
            We abandon the reactive model of medicine. We don't wait for the machine to break. 
            By marrying biological intuition with relentless data fidelity, we map the trajectory of your health before deviation occurs.
          </p>
          <div className="reveal-text mt-8 w-16 h-1 bg-clay rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;