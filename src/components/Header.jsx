import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'

// Pages with dark hero backgrounds — nav text should be white when unscrolled
const DARK_HERO_ROUTES = ['/cakes']

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Reset scroll state on route change
    setScrolled(window.scrollY > 40)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Menu', to: '/#products' },
    { label: 'Cakes', to: '/cakes' },
    { label: 'About', to: '/#about' },
    { label: 'Contact', to: '/#contact' },
  ]

  // On dark-hero pages and not yet scrolled → use white text
  const isDarkHero = DARK_HERO_ROUTES.includes(location.pathname) && !scrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group">
          <span
            className={`font-serif text-2xl font-light tracking-[0.2em] transition-colors duration-300 ${
              isDarkHero ? 'text-white group-hover:text-cream-200' : 'text-brown-800 group-hover:text-brown-600'
            }`}
          >
            WESTERN
          </span>
          <span
            className={`font-sans text-[10px] tracking-[0.5em] font-extralight -mt-1 uppercase transition-colors duration-300 ${
              isDarkHero ? 'text-cream-200/70' : 'text-brown-400'
            }`}
          >
            Bakery & Kitchen
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`font-sans text-xs tracking-[0.2em] uppercase font-light transition-all duration-200 hover:tracking-[0.3em]
                ${isDarkHero
                  ? location.pathname === link.to
                    ? 'text-white border-b border-white/60 pb-0.5'
                    : 'text-white/80 hover:text-white'
                  : location.pathname === link.to
                    ? 'text-brown-700 border-b border-brown-400 pb-0.5'
                    : 'text-brown-500 hover:text-brown-700'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            className={`flex items-center gap-2 text-xs px-6 py-2.5 rounded-full tracking-widest uppercase transition-all duration-300 hover:scale-105 font-sans font-normal ${
              isDarkHero
                ? 'bg-[#C8A27C] text-brown-900 hover:bg-[#b8926c]'
                : 'btn-primary'
            }`}
          >
            <ShoppingBag size={14} />
            Order Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden transition-colors ${isDarkHero ? 'text-white' : 'text-brown-700'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brown-900/95 backdrop-blur-md border-t border-white/10 py-6 px-6 flex flex-col gap-5 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button className="btn-primary w-fit text-xs">Order Now</button>
        </div>
      )}
    </header>
  )
}
