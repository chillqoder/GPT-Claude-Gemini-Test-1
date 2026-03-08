import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Philosophy from './components/Philosophy';
import Protocol from './components/Protocol';
import Membership from './components/Membership';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const appRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Global app-level animations can go here
    }, appRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={appRef} className="relative w-full min-h-screen bg-cream selection:bg-moss selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <Membership />
      <Footer />
    </div>
  );
}

export default App;