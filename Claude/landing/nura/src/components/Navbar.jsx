import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Features', 'Philosophy', 'Protocol', 'Membership']

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-full transition-all duration-500 ${
        scrolled
          ? 'bg-white/60 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
      style={scrolled ? { border: '1px solid rgba(46,64,54,0.1)' } : {}}
    >
      <div className="flex items-center gap-12">
        <a
          href="#"
          className={`text-xl font-heading font-bold tracking-tight transition-colors duration-500 ${
            scrolled ? 'text-moss' : 'text-white'
          }`}
        >
          nura
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`text-sm font-medium tracking-wide transition-colors duration-500 hover:opacity-70 ${
                scrolled ? 'text-moss' : 'text-white/80'
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        <a
          href="#membership"
          className={`hidden md:inline-flex text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-500 ${
            scrolled
              ? 'bg-moss text-cream hover:bg-moss-light'
              : 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border border-white/20'
          }`}
        >
          Get Started
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden transition-colors duration-500 ${
            scrolled ? 'text-moss' : 'text-white'
          }`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-moss/10 flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-moss/80 hover:text-moss"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
