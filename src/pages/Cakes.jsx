import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ArrowLeft, X, ChevronRight } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    ;(async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/categories`),
        ])
        setCakes(pRes.data.filter(p => p.category?.name?.toLowerCase() === 'cakes'))
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

  const cakeCategories = [
    { name: 'All', icon: '🎂' },
    ...categories.map(c => ({ name: c.name, icon: c.icon || '🍽️' }))
  ]

  return (
    <div className="bg-white min-h-screen font-sans overflow-hidden">

      {/* ── Fixed Sticky Navbar ────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#EDE8DE]/80 shadow-sm">
        <div className="max-w-md mx-auto px-4 pt-3 pb-2">

          {/* Top row: back | title | search */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBack}
              className="p-1.5 rounded-full text-[#5C3A21] hover:bg-[#EDE8DE]/60 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex flex-col items-center">
              <div className="text-base leading-none mb-0.5">🎂</div>
              <h1 className="font-serif italic font-bold text-xl sm:text-2xl text-[#3D2712] tracking-wide leading-none">
                Cake Menu
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-px w-5 bg-[#C8A27C]" />
                <span className="text-[#A87850] text-[9px] font-serif">✦</span>
                <div className="h-px w-5 bg-[#C8A27C]" />
              </div>
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 rounded-full text-[#5C3A21] hover:bg-[#EDE8DE]/60 transition-colors"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Search input */}
          {searchOpen && (
            <div className="mb-2">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search cakes..."
                  autoFocus
                  className="w-full pl-4 pr-10 py-1.5 bg-white border border-[#DED6C8] rounded-full text-sm text-[#3D2712] focus:outline-none focus:border-[#A87850]"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A87850]">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {cakeCategories.map((cat) => {
              const isActive = activeCategory === cat.name
              return (
                <div
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`min-w-[52px] py-1.5 px-2 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'text-[#FAF6F0] shadow-sm'
                      : 'bg-white text-[#5C3A21] border border-[#DED6C8]'
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
        </div>
      </div>

      {/* ── Scrollable Content (padded below fixed navbar) ── */}
      <div className="max-w-md mx-auto px-4 pb-12" style={{ paddingTop: searchOpen ? '168px' : '146px' }}>

        {loading && (
          <div className="text-center py-12 text-[#A87850] text-xs tracking-widest animate-pulse font-medium">
            Loading Cake Menu...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#A87850] text-sm font-medium">
              {search ? 'No cakes matched your search.' : 'No cakes added yet.'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-2 text-xs text-[#5C3A21] underline font-semibold">
                Clear Search
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {filtered.map((item, index) => (
            <div
              key={item._id || index}
              onClick={() => setSelectedItem(item)}
              className="flex bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200"
              style={{
                border: '1px solid #EDE8DE',
                boxShadow: '0 4px 16px rgba(90,60,30,0.06)',
                animationDelay: `${index * 30}ms`,
                animation: 'fadeInUp 0.35s ease-out forwards',
                opacity: 0,
              }}
            >
              {/* Image */}
              <div className="w-[140px] sm:w-[170px] h-[96px] sm:h-[112px] shrink-0 overflow-hidden rounded-xl m-1.5"
                style={{ background: '#F5EDE3' }}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-[#C8A27C]">🎂</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex items-center justify-between px-3 sm:px-4 py-2 min-w-0">
                <div className="flex flex-col justify-center min-w-0 pr-2">
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#3D2712] leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="font-sans text-[10px] sm:text-[11px] text-[#A87850] font-light mt-0.5 line-clamp-2 leading-tight">
                    {getCakeDescription(item.name)}
                  </p>
                  <span className="font-serif font-extrabold text-sm sm:text-base text-[#5C3A21] mt-1.5">
                    ₹{item.price}
                  </span>
                </div>
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

      {/* ── Cake Detail Modal ─────────────────────────────── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(30,10,5,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'fadeInUp 0.3s ease-out' }}
          >
            {/* Full-size image */}
            <div className="w-full h-56 sm:h-64 overflow-hidden relative" style={{ background: '#F5EDE3' }}>
              {selectedItem.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-[#C8A27C]">🎂</div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Details */}
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-serif text-xl font-bold text-[#3D2712] leading-snug flex-1">
                  {selectedItem.name}
                </h2>
                <span className="font-serif text-xl font-extrabold text-[#5C3A21] whitespace-nowrap">
                  ₹{selectedItem.price}
                </span>
              </div>
              <p className="text-sm text-[#A87850] font-sans leading-relaxed">
                {getCakeDescription(selectedItem.name)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
