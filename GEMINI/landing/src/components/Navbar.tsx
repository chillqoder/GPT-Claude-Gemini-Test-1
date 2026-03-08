import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: {
          className: 'scrolled',
          targets: navRef.current,
        },
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav 
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl rounded-full transition-all duration-500 flex items-center justify-between px-8 py-4 text-white border border-transparent [&.scrolled]:bg-white/60 [&.scrolled]:backdrop-blur-md [&.scrolled]:text-moss [&.scrolled]:border-white/40 [&.scrolled]:shadow-sm"
    >
      <div className="font-outfit font-bold text-xl tracking-tight uppercase">Nura</div>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <a href="#features" className="hover:opacity-70 transition-opacity">Intelligence</a>
        <a href="#philosophy" className="hover:opacity-70 transition-opacity">Philosophy</a>
        <a href="#protocol" className="hover:opacity-70 transition-opacity">Protocol</a>
      </div>
      <button className="bg-clay text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-clay/90 transition-colors">
        Access System
      </button>
    </nav>
  );
};

export default Navbar;