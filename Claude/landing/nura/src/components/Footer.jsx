import { Activity } from 'lucide-react'

export default function Footer() {
  const links = {
    Protocol: ['Features', 'Philosophy', 'Science', 'Research'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Compliance', 'Security'],
  }

  return (
    <footer className="bg-charcoal pt-20 pb-8 px-6 md:px-8" style={{ borderRadius: '4rem 4rem 0 0' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div>
            <h3 className="text-2xl font-heading font-bold text-cream mb-4">nura</h3>
            <p className="text-cream/40 text-sm leading-relaxed">
              Precision wellness intelligence built on your biological signals.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-xs font-mono text-cream/30">System Operational</span>
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-mono text-cream/30 tracking-wider uppercase mb-4">{title}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-cream/50 hover:text-cream transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/20 font-mono">
            &copy; 2026 Nura Health. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-cream/20 font-mono">
            <Activity size={12} className="text-clay/50" />
            <span>v3.2.1 — Neural Engine Active</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
