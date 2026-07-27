import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer id="contact" className="bg-brown-900 text-cream-200">
      {/* Contact + links */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-serif text-2xl font-light tracking-[0.2em] text-cream-50 mb-1">WESTERN</p>
          <p className="font-sans text-[10px] tracking-[0.5em] text-brown-300 font-extralight uppercase mb-4">Bakery & Kitchen</p>
          <p className="font-sans text-xs font-extralight text-brown-300 leading-relaxed">
            Crafting premium baked goods and culinary delights since 2010.
          </p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full border border-brown-600 flex items-center justify-center text-brown-300 hover:text-cream-50 hover:border-cream-50 transition-all duration-200">
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-sans text-[10px] tracking-[0.3em] text-brown-400 uppercase mb-5">Quick Links</p>
          {[
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/#products' },
            { label: 'Cake Collection', to: '/cakes' },
            { label: 'About Us', to: '/#about' },
          ].map(l => (
            <Link key={l.label} to={l.to} className="block font-sans text-xs font-extralight text-brown-300 hover:text-cream-50 transition-colors mb-2">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div>
          <p className="font-sans text-[10px] tracking-[0.3em] text-brown-400 uppercase mb-5">Categories</p>
          {['Cakes', 'Pastries', 'Breads', 'Cookies', 'Shawarma', 'Biryani'].map(c => (
            <p key={c} className="font-sans text-xs font-extralight text-brown-300 mb-2">{c}</p>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p className="font-sans text-[10px] tracking-[0.3em] text-brown-400 uppercase mb-5">Contact Us</p>
          <div className="flex flex-col gap-3">
            {[
              { Icon: MapPin, text: '123 Bakery Street, City' },
              { Icon: Phone, text: '+91 98765 43210' },
              { Icon: Mail, text: 'hello@westernbakery.com' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-brown-300">
                <Icon size={13} className="shrink-0 text-brown-400" />
                <p className="font-sans text-xs font-extralight">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brown-800 max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-sans text-[10px] font-extralight text-brown-500 tracking-widest">
          © {new Date().getFullYear()} Western Bakery & Kitchen. All rights reserved.
        </p>
        <Link to="/admin" className="font-sans text-[10px] font-extralight text-brown-600 hover:text-brown-400 tracking-widest transition-colors">
          Admin Panel
        </Link>
      </div>
    </footer>
  )
}
