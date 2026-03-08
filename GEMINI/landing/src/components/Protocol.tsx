import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProtocolCardProps {
  index: number;
  title: string;
  subtitle: string;
  artifact: React.ReactNode;
  zIndex: number;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ index, title, subtitle, artifact, zIndex }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Scale and blur this card as we scroll past it (when the next card is coming up)
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: true,
        animation: gsap.to(contentRef.current, {
          scale: 0.9,
          filter: 'blur(20px)',
          opacity: 0.5,
          ease: 'none'
        })
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={cardRef} 
      className="sticky top-0 h-screen w-full flex items-center justify-center p-8"
      style={{ zIndex }}
    >
      <div 
        ref={contentRef}
        className="relative w-full max-w-6xl h-[80vh] bg-cream rounded-[3rem] shadow-2xl border border-moss/10 p-8 md:p-16 flex flex-col justify-between overflow-hidden"
      >
        <div className="relative z-10">
          <div className="font-mono text-clay text-sm tracking-widest uppercase mb-4">Phase 0{index + 1}</div>
          <h2 className="font-sans font-bold text-5xl md:text-7xl text-moss mb-4">{title}</h2>
          <p className="font-outfit text-xl text-charcoal/60 max-w-md">{subtitle}</p>
        </div>
        
        {/* Artifacts */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-8 md:pr-24 opacity-30">
          {artifact}
        </div>
      </div>
    </div>
  );
};

const Protocol = () => {
  return (
    <section id="protocol" className="relative w-full bg-charcoal">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 text-cream/30 font-serif italic text-3xl">
        The Protocol
      </div>
      
      <ProtocolCard 
        index={0} 
        zIndex={10}
        title="Extraction" 
        subtitle="Establishing the absolute biological baseline through comprehensive multi-omic sequencing."
        artifact={
          <svg className="w-64 h-64 md:w-96 md:h-96 animate-[spin_10s_linear_infinite] text-moss" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      />
      
      <ProtocolCard 
        index={1} 
        zIndex={20}
        title="Synthesis" 
        subtitle="Correlating molecular telemetry against optimal physiological blueprints."
        artifact={
          <div className="w-64 h-64 md:w-96 md:h-96 border border-clay rounded-full flex items-center justify-center relative">
             <div className="absolute inset-0 border-t-2 border-clay rounded-full animate-[spin_8s_linear_infinite]"></div>
             <div className="w-48 h-48 md:w-64 md:h-64 border border-moss/50 rounded-full flex items-center justify-center relative">
               <div className="absolute inset-0 border-b-2 border-moss rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
             </div>
          </div>
        }
      />
      
      <ProtocolCard 
        index={2} 
        zIndex={30}
        title="Integration" 
        subtitle="Deploying the kinetic regimen. Adaptive protocols for peak biological performance."
        artifact={
          <svg className="w-64 md:w-[30rem] h-64 text-moss" viewBox="0 0 100 20" preserveAspectRatio="none" stroke="currentColor" fill="none" strokeWidth="0.5">
            <path className="animate-pulse" d="M0,10 L20,10 L25,5 L30,15 L35,10 L50,10 L55,0 L60,20 L65,10 L100,10" />
          </svg>
        }
      />
    </section>
  );
};

export default Protocol;