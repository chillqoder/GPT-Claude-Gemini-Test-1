import { useState, useEffect, useRef } from 'react';
import { Activity, Beaker, Fingerprint } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DiagnosticShuffler = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Biomarker Analysis', status: 'Optimal', icon: <Activity className="w-5 h-5 text-moss" /> },
    { id: 2, title: 'Cellular Integrity', status: 'Processing...', icon: <Beaker className="w-5 h-5 text-clay" /> },
    { id: 3, title: 'Neural Baseline', status: 'Verified', icon: <Fingerprint className="w-5 h-5 text-moss" /> },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const newArr = [...prev];
        const last = newArr.pop();
        if (last) newArr.unshift(last);
        return newArr;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      {cards.map((card, idx) => (
        <div 
          key={card.id}
          className="absolute w-full max-w-[240px] bg-white p-5 rounded-3xl shadow-sm border border-moss/5 transition-all duration-700"
          style={{
            zIndex: cards.length - idx,
            transform: `translateY(${idx * 16}px) scale(${1 - idx * 0.05})`,
            opacity: 1 - idx * 0.2,
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="bg-cream p-2 rounded-xl">{card.icon}</div>
            <span className="text-xs font-mono text-moss/50 uppercase tracking-wider">ID-{card.id}</span>
          </div>
          <h4 className="font-outfit font-semibold text-charcoal">{card.title}</h4>
          <p className="text-sm text-charcoal/60 mt-1">{card.status}</p>
        </div>
      ))}
    </div>
  );
};

const TelemetryTypewriter = () => {
  const messages = [
    "Optimizing Circadian Rhythm...",
    "Calibrating Neural Pathways...",
    "Synthesizing Baseline Metrics...",
    "Aligning Organic Signatures..."
  ];
  const [text, setText] = useState('');
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (charIdx < messages[msgIdx].length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + messages[msgIdx][charIdx]);
        setCharIdx(prev => prev + 1);
      }, Math.random() * 50 + 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setText('');
        setCharIdx(0);
        setMsgIdx(prev => (prev + 1) % messages.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [charIdx, msgIdx]);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-clay animate-pulse"></div>
        <span className="font-mono text-xs text-moss/50 uppercase tracking-widest">Live Stream</span>
      </div>
      <div className="font-mono text-lg text-moss flex-1">
        {text}
        <span className="inline-block w-2 h-5 bg-clay ml-1 animate-pulse align-middle"></span>
      </div>
      <div className="mt-4 border-t border-moss/10 pt-4 flex justify-between font-mono text-xs text-moss/40">
        <span>SYS.OPS</span>
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
    </div>
  );
};

const MockCursorProtocol = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<SVGSVGElement>(null);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    
    const animate = () => {
      if (!containerRef.current || !cursorRef.current) return;
      const time = (Date.now() - startTime) / 1000;
      
      const x = Math.sin(time * 1.5) * 60 + 80;
      const y = Math.cos(time * 2) * 40 + 60;
      
      cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
      
      const cellX = Math.floor(x / 40);
      const cellY = Math.floor(y / 40);
      const newActive = (cellY * 4 + cellX) % 12;
      
      if (Math.random() > 0.95) {
        setActiveCell(newActive);
      }

      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full bg-cream/50 rounded-2xl overflow-hidden p-4 flex flex-col">
      <div className="font-outfit text-sm font-semibold text-moss mb-4">Weekly Regimen</div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {Array.from({length: 12}).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "rounded-xl border border-moss/5 transition-colors duration-300",
              activeCell === i ? "bg-moss/20" : "bg-white"
            )}
          />
        ))}
      </div>
      <svg 
        ref={cursorRef}
        className="absolute top-0 left-0 w-6 h-6 text-charcoal drop-shadow-md z-10 transition-transform duration-75" 
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5.5 3.21V20.8C5.5 21.43 6.25 21.76 6.72 21.34L10.5 17.9H16.5C17.05 17.9 17.5 17.45 17.5 16.9V16.48C17.5 16.2 17.38 15.93 17.17 15.75L6.96 6.8C6.54 6.43 5.5 6.73 5.5 7.29Z" fill="currentColor"/>
      </svg>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-24 px-8 md:px-16 lg:px-24 bg-cream text-charcoal">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-moss">Precision Micro-UI Dashboard</h2>
          <p className="font-serif italic text-2xl text-charcoal/60 mt-4 max-w-2xl">Clinical telemetry wrapped in boutique aesthetics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-moss/5 rounded-[3rem] p-8 md:p-10 flex flex-col h-[400px]">
            <h3 className="font-outfit text-xl font-bold text-moss mb-2">Audit Intelligence</h3>
            <p className="text-sm text-charcoal/60 mb-8">Diagnostic Shuffler algorithm verifying biological markers.</p>
            <div className="flex-1 flex items-center justify-center">
              <DiagnosticShuffler />
            </div>
          </div>

          <div className="bg-moss/5 rounded-[3rem] p-8 md:p-10 flex flex-col h-[400px]">
            <h3 className="font-outfit text-xl font-bold text-moss mb-2">Neural Stream</h3>
            <p className="text-sm text-charcoal/60 mb-8">Real-time telemetry and systemic feedback loops.</p>
            <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-moss/5">
              <TelemetryTypewriter />
            </div>
          </div>

          <div className="bg-moss/5 rounded-[3rem] p-8 md:p-10 flex flex-col h-[400px]">
            <h3 className="font-outfit text-xl font-bold text-moss mb-2">Adaptive Regimen</h3>
            <p className="text-sm text-charcoal/60 mb-8">Automated protocol scheduler adapting to your needs.</p>
            <div className="flex-1">
              <MockCursorProtocol />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;