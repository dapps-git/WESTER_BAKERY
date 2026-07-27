import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import heroBg from '../assets/hero_bg.png'

const HERO_SLIDES = [
  { tag: 'Artisan Crafted', heading: 'Freshly Baked,\nJust for You', sub: 'Every loaf, every pastry, every cake — made with love and the finest ingredients.' },
  { tag: 'Made Daily', heading: 'From Our Oven\nTo Your Table', sub: 'Warm breads, flaky croissants, and decadent cakes baked fresh every morning.' },
  { tag: 'Premium Quality', heading: 'A Taste of\nTrue Luxury', sub: 'Indulge in world-class flavours crafted by our master bakers every single day.' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const intervalRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => {
      clearTimeout(timer)
      clearInterval(intervalRef.current)
    }
  }, [])

  const slide = HERO_SLIDES[current]

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[8000ms]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50/20 via-cream-50/10 to-cream-50/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-cream-50/50 via-transparent to-transparent" />

      {/* Central Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Content */}
        <div
          className={`max-w-2xl w-full p-6 md:p-10 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Tag */}
          <p className="section-subheading animate-fade-in">{slide.tag}</p>

          {/* Heading */}
          <h1
            key={current}
            className="font-serif text-4xl md:text-6xl text-brown-800 font-light leading-tight mb-5 whitespace-pre-line"
            style={{ animation: 'fadeInUp 0.7s ease-out' }}
          >
            {slide.heading}
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-brown-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-brown-400" />
            <div className="h-px w-12 bg-brown-300" />
          </div>

          {/* Sub */}
          <p
            key={`sub-${current}`}
            className="font-sans font-extralight text-brown-500 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8"
            style={{ animation: 'fadeInUp 0.9s ease-out' }}
          >
            {slide.sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="btn-primary"
            >
              Explore Menu
            </button>
            <button onClick={() => navigate('/cakes')} className="btn-outline">
              Cake Collection
            </button>
          </div>
        </div>

        {/* Slide dots */}
        <div className="flex gap-2 mt-8">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-8 h-2 bg-brown-600' : 'w-2 h-2 bg-brown-300'
              }`}
            />
          ))}
        </div>
      </div>


    </section>
  )
}
