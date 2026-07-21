import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ArrowLeft, X, ChevronRight } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Fallback one-liner descriptions
const CAKE_DESCRIPTIONS = {
  chocolate: 'Rich chocolate sponge with smooth truffle frosting.',
  'red velvet': 'Classic red velvet with creamy cheese frosting.',
  fruit: 'Light sponge layered with fresh fruits & whipped cream.',
  cheese: 'Creamy New York style baked cheesecake.',
  blueberry: 'Soft vanilla sponge filled with juicy blueberry compote.',
  vanilla: 'Classic vanilla sponge with silky buttercream.',
  strawberry: 'Fresh strawberry cream layered sponge cake.',
  mango: 'Tropical mango mousse on a soft sponge base.',
  black: 'Dark chocolate layers with whipped ganache.',
  default: 'Handcrafted fresh cake with premium ingredients.',
}

const getCakeDescription = (name) => {
  const k = name.toLowerCase()
  for (const [key, desc] of Object.entries(CAKE_DESCRIPTIONS)) {
    if (k.includes(key)) return desc
  }
  return CAKE_DESCRIPTIONS.default
}

export default function Cakes() {
  const navigate = useNavigate()
  const [cakes, setCakes] = useState([])
  const [categories, setCategories] = useState([]) // fetched from backend
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    window.scrollTo(0, 0)
    ;(async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/categories`),
        ])
        setCakes(pRes.data.filter(p => p.category?.name?.toLowerCase() === 'cakes'))
        // Only show categories that are "Cakes" sub-types — fall back to all if none
        setCategories(cRes.data)
      } catch {
        /* silent */
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const filtered = cakes.filter(c => {
    const matchSrch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' ||
      c.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      c.category?.name === activeCategory
    return matchSrch && matchCat
  })

  // Build category tabs: "All" + all backend categories that are cake-related
  // For cake page, show "All" plus any categories named like cake types
  const cakeCategories = [
    { name: 'All', icon: '🎂' },
    ...categories.map(c => ({ name: c.name, icon: c.icon || '🍽️' }))
  ]

  return (
    <div className="min-h-screen font-sans pb-12 bg-white">
      <div className="max-w-md mx-auto px-4 pt-4">

        {/* ── Top Header — Brown / Cream Theme ─────────────── */}
        <header className="flex items-center justify-between mb-5">
          <button
            onClick={handleBack}
            className="p-1.5 rounded-full text-[#5C3A21] hover:bg-[#EDE8DE]/60 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>

          {/* Center — Cormorant Garamond Serif Title */}
          <div className="flex flex-col items-center">
            <div className="text-xl leading-none mb-0.5">🎂</div>
            <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#3D2712] tracking-wide leading-none">
              Cake Menu
            </h1>
            {/* Cream ornament divider */}
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-8 bg-[#C8A27C]" />
              <span className="text-[#A87850] text-[10px] font-serif">✦</span>
              <div className="h-px w-8 bg-[#C8A27C]" />
            </div>
          </div>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 rounded-full text-[#5C3A21] hover:bg-[#EDE8DE]/60 transition-colors"
          >
            <Search size={22} />
          </button>
        </header>

        {/* ── Search Bar ─────────────────────────────────────── */}
        {searchOpen && (
          <div className="mb-4 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search cakes..."
                autoFocus
                className="w-full pl-4 pr-10 py-2 bg-white border border-[#DED6C8] rounded-full text-sm text-[#3D2712] focus:outline-none focus:border-[#A87850] shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A87850] hover:text-[#5C3A21]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Category Chips from Backend ──────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {cakeCategories.map((cat) => {
            const isActive = activeCategory === cat.name
            return (
              <div
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`min-w-[56px] sm:min-w-[64px] py-1.5 px-2 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'text-[#FAF6F0] shadow-md'
                    : 'bg-white text-[#5C3A21] border border-[#DED6C8] shadow-[0_2px_8px_rgba(90,60,30,0.07)] hover:border-[#C8A27C]'
                }`}
                style={isActive ? { background: '#5C3A21' } : {}}
              >
                <div className="text-sm mb-0.5">{cat.icon}</div>
                <span className="block text-[10px] font-semibold tracking-tight whitespace-nowrap">
                  {cat.name}
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Loading ──────────────────────────────────────── */}
        {loading && (
          <div className="text-center py-12 text-[#A87850] text-xs tracking-widest animate-pulse font-medium">
            Loading Cake Menu...
          </div>
        )}

        {/* ── Empty State ──────────────────────────────────── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#A87850] text-sm font-medium">
              {search ? 'No cakes matched your search.' : 'No cakes added yet.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-2 text-xs text-[#5C3A21] underline font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* ── Cake Cards — Brown / Cream Theme ───────────── */}
        <div className="flex flex-col gap-2">
          {filtered.map((item, index) => (
            <div
              key={item._id || index}
              className="flex bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200"
              style={{
                border: '1px solid #EDE8DE',
                boxShadow: '0 4px 16px rgba(90,60,30,0.06)',
                animationDelay: `${index * 30}ms`,
                animation: 'fadeInUp 0.35s ease-out forwards',
                opacity: 0,
              }}
            >
              {/* Wide Landscape Rectangle Image */}
              <div className="w-[140px] sm:w-[170px] h-[96px] sm:h-[112px] shrink-0 overflow-hidden rounded-xl m-1.5"
                style={{ background: '#F5EDE3' }}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-[#C8A27C]">
                    🎂
                  </div>
                )}
              </div>

              {/* Right — Name, Description, Brown Price, Cream Arrow */}
              <div className="flex-1 flex items-center justify-between px-3 sm:px-4 py-2 min-w-0">
                <div className="flex flex-col justify-center min-w-0 pr-2">
                  {/* Serif title */}
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#3D2712] leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  {/* One-liner description */}
                  <p className="font-sans text-[10px] sm:text-[11px] text-[#A87850] font-light mt-0.5 line-clamp-2 leading-tight">
                    {getCakeDescription(item.name)}
                  </p>
                  {/* Brown price */}
                  <span className="font-serif font-extrabold text-sm sm:text-base text-[#5C3A21] mt-1.5">
                    ₹{item.price}
                  </span>
                </div>

                {/* Cream circular arrow */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-all"
                  style={{ background: '#EDE8DE', color: '#5C3A21' }}
                >
                  <ChevronRight size={15} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
