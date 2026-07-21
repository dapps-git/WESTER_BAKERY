import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Cakes() {
  const [cakes, setCakes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchCakes = async () => {
      try {
        // Fetch all products and filter for 'Cakes' category on the frontend for safety,
        // and fetch with backend filter as well.
        const res = await axios.get(`${API}/api/products`)
        const allProducts = res.data
        const cakeProducts = allProducts.filter(
          p => p.category?.name?.toLowerCase() === 'cakes'
        )
        setCakes(cakeProducts)
      } catch {
        // backend not connected yet
      } finally {
        setLoading(false)
      }
    }
    fetchCakes()
  }, [])

  // 4 circular/square featured categories for Handcrafted Cakes section
  const HANDCRAFTED_STYLES = [
    {
      title: 'HANDCRAFTED CAKES',
      sub: 'Artisan & Premium',
      img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80',
      bgColor: 'bg-[#f5cad2]'
    },
    {
      title: 'FRENCH PASTRIES',
      sub: 'Classic French Style',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
      bgColor: 'bg-[#d0d6d6]'
    },
    {
      title: 'SEASONAL SPECIALS',
      sub: 'Fresh Fruit Mix',
      img: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=400&auto=format&fit=crop&q=80',
      bgColor: 'bg-[#f5cad2]'
    },
    {
      title: 'FEDERAL SPECIALS',
      sub: 'Signature Delights',
      img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80',
      bgColor: 'bg-[#d0d6d6]'
    }
  ]

  return (
    <div className="min-h-screen" style={{ background: '#fdf6f8' }}>
      <Header />

      {/* Hero Banner — Pink Theme with Cakes & Roses background */}
      <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden flex items-center">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=1600&auto=format&fit=crop&q=80')`,
            backgroundPosition: 'center 35%'
          }}
        />
        {/* Soft pink overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(253, 240, 244, 0.9) 20%, rgba(253, 240, 244, 0.4) 60%, rgba(255, 255, 255, 0) 100%)'
          }}
        />
        
        {/* Top Right Decorative Roses (Faded background detail) */}
        <div className="absolute top-10 right-10 opacity-30 pointer-events-none hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&auto=format&fit=crop&q=80" 
            alt="decorative roses" 
            className="w-80 h-80 object-cover rounded-full mix-blend-multiply filter blur-sm"
          />
        </div>

        {/* Text content layout from mockup */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col items-start">
          <h1
            className="font-serif text-5xl md:text-7xl font-light leading-tight mb-5 text-[#4a2e18]"
            style={{ textShadow: '0 1px 4px rgba(255,255,255,0.6)' }}
          >
            Bite <br />
            <span className="italic font-normal">into</span> Happiness
          </h1>
          
          {/* CRÈME WOW Tag/Button */}
          <button
            className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-white px-8 py-3 rounded-md shadow-md transition-all duration-300 hover:scale-105"
            style={{ background: '#e08285' }}
          >
            CRÈME WOW
          </button>
        </div>
      </section>

      {/* 1. HANDCRAFTED CAKES Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-xl tracking-[0.3em] uppercase text-[#4a2e18] font-normal">
            HANDCRAFTED CAKES
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-0.5 w-12 bg-[#e8c0ce]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8849b]" />
            <div className="h-0.5 w-12 bg-[#e8c0ce]" />
          </div>
        </div>

        {/* 4-column layout matching mockup styles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {HANDCRAFTED_STYLES.map((style, i) => (
            <div
              key={style.title}
              className="group flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Square image */}
              <div className="aspect-square overflow-hidden bg-cream-50">
                <img
                  src={style.img}
                  alt={style.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Bottom text banner */}
              <div className={`p-4 text-center ${style.bgColor} transition-colors duration-300`}>
                <h3 className="font-serif text-xs font-semibold tracking-wider text-brown-800 leading-tight">
                  {style.title}
                </h3>
                <p className="font-sans text-[9px] text-brown-500 font-light mt-1">
                  {style.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. FEATUREDS Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-t border-[#f5cad2]/30">
        <div className="text-center mb-16">
          <h2 className="font-serif text-xl tracking-[0.3em] uppercase text-[#4a2e18] font-normal">
            FEATUREDS
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-0.5 w-12 bg-[#e8c0ce]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8849b]" />
            <div className="h-0.5 w-12 bg-[#e8c0ce]" />
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-brown-300 font-sans text-sm tracking-widest">
            Loading Featureds...
          </div>
        )}

        {/* 4-column layout: 3 cake products + 1 pink Valentine's promo card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Cake products rendered cleanly without borders or backgrounds */}
          {cakes.slice(0, 3).map((cake, i) => (
            <div
              key={cake._id}
              className="group flex flex-col justify-between cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div>
                {/* Photo ONLY: No card container border or background color */}
                <div className="aspect-square overflow-hidden rounded-2xl mb-4 relative">
                  {cake.imageUrl ? (
                    <img
                      src={cake.imageUrl}
                      alt={cake.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-[#fdf0f4]">🎂</div>
                  )}
                  {/* Hover Add Button */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-[#ef4444] text-white text-xs font-sans tracking-widest uppercase font-semibold px-4 py-2 rounded-full shadow-lg">
                      Order
                    </button>
                  </div>
                </div>

                <div className="px-1 text-center sm:text-left">
                  <h3 className="font-serif text-sm text-brown-800 font-normal mb-1">
                    {cake.name}
                  </h3>
                  <p className="font-sans text-[10px] text-brown-400 font-light mb-2">
                    Handcrafted with love
                  </p>
                </div>
              </div>

              <div className="px-1 mt-1 text-center sm:text-left">
                <p className="font-serif text-sm font-semibold text-[#ef4444]">
                  ₹{cake.price}
                </p>
              </div>
            </div>
          ))}

          {/* Placeholders if we don't have enough cakes in the database */}
          {!loading && cakes.length < 3 && [...Array(3 - cakes.length)].map((_, i) => (
            <div key={`placeholder-${i}`} className="group flex flex-col justify-between opacity-70">
              <div>
                <div className="aspect-square overflow-hidden rounded-2xl mb-4 bg-white border border-[#f5cad2]/30 flex items-center justify-center text-5xl">
                  🎂
                </div>
                <div className="px-1">
                  <h3 className="font-serif text-sm text-brown-800 font-normal mb-1">
                    Signature Cake
                  </h3>
                  <p className="font-sans text-[10px] text-brown-400 font-light mb-2">
                    Fresh ingredients
                  </p>
                </div>
              </div>
              <div className="px-1 mt-1">
                <p className="font-serif text-sm font-semibold text-[#ef4444]">
                  ₹550
                </p>
              </div>
            </div>
          ))}

          {/* Promo Card: Valentine's Edition (Matching mockup pink promo block) */}
          <div className="bg-[#e28389] text-white rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-md min-h-[300px]">
            <div className="mt-4">
              <h3 className="font-serif text-lg font-light leading-snug tracking-wide">
                Valentine's <br />
                Edition Desserts
              </h3>
              <p className="font-sans text-xs font-light mt-3 tracking-wider">
                Special offer
              </p>
              <p className="font-serif text-3xl font-bold mt-2 tracking-wide">
                15% OFF
              </p>
            </div>
            
            <div className="w-full mb-2">
              <button className="w-full bg-[#fdf6f8] text-[#e28389] text-xs font-sans tracking-widest uppercase font-semibold py-2.5 rounded-lg shadow hover:bg-white transition-colors">
                ORDER NOW
              </button>
              <span className="block font-sans text-[9px] mt-2 tracking-widest text-[#fdf6f8]/80">
                LIMITED STOCKS
              </span>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
