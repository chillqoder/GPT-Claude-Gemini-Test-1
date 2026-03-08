

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white rounded-t-[4rem] px-8 md:px-16 py-16 mt-[-4rem] relative z-10 border-t-4 border-charcoal">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-12">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-outfit font-bold text-3xl tracking-tight uppercase">Nura</div>
          <p className="font-serif italic text-white/50">Biological optimization engineered.</p>
        </div>
        
        <div className="flex gap-12 font-mono text-sm text-white/60">
          <a href="#features" className="hover:text-clay transition-colors">Intelligence</a>
          <a href="#philosophy" className="hover:text-clay transition-colors">Philosophy</a>
          <a href="#protocol" className="hover:text-clay transition-colors">Protocol</a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-xs text-white/40">
          &copy; {new Date().getFullYear()} NURA HEALTH. ALL RIGHTS RESERVED.
        </div>
        
        {/* System Operational Status Indicator */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse shadow-[0_0_8px_#A3E635]"></div>
          <span className="font-mono text-xs text-white/70 tracking-widest uppercase">System Operational</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;