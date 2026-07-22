import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ArrowLeft, X, Plus, Bell, Heart, Star } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DEMO_CAKES = [
  {
    _id: 'demo-1',
    name: 'Candyland Carnival Cake',
    price: 14.0,
    category: { name: 'Birthday Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    description: 'Decadent dark chocolate layers dripping with rich ganache, topped with fresh strawberries.',
    rating: 4.9,
  },
  {
    _id: 'demo-2',
    name: 'Rainbow Burst Gem Cake',
    price: 12.0,
    category: { name: 'Custom Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant pink cream layers topped with sprinkles and a mini waffle cone accent.',
    rating: 4.8,
  },
  {
    _id: 'demo-3',
    name: 'Cherry Blossom Cake',
    price: 16.0,
    category: { name: 'Birthday Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
    description: 'Delicate chocolate wafer crust filled with velvety cocoa sponge and festive sprinkles.',
    rating: 4.9,
  },
  {
    _id: 'demo-4',
    name: 'Cookie Dough Fudge Cake',
    price: 18.0,
    category: { name: 'Wedding Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80',
    description: 'Creamy chocolate rosettes layered over rich sponge cake with rainbow sugar crystals.',
    rating: 5.0,
  },
]

export default function Cakes() {
  const navigate = useNavigate()
  const [cakes, setCakes] = useState(DEMO_CAKES)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useState({})

  useEffect(() => {
    window.scrollTo(0, 0)
    ;(async () => {
      try {
        const pRes = await axios.get(`${API}/api/products`)
        const apiCakes = pRes.data.filter(p => p.category?.name?.toLowerCase() === 'cakes')
        if (apiCakes && apiCakes.length > 0) {
          // Merge API cakes with Demo cakes to ensure at least 4 beautiful cakes are always visible
          setCakes([...apiCakes, ...DEMO_CAKES])
        } else {
          setCakes(DEMO_CAKES)
        }
      } catch {
        setCakes(DEMO_CAKES)
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

  const toggleFavorite = (e, id) => {
    e.stopPropagation()
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const cakeCategoryNames = ['All', 'Wedding Cakes', 'Birthday Cakes', 'Cupcakes', 'Custom Cakes']

  const filtered = cakes.filter(c => {
    const matchSrch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' ||
      c.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      c.category?.name === activeCategory
    return matchSrch && matchCat
  })

  return (
    <div className="bg-[#F6F7F9] min-h-screen font-sans text-gray-900 pb-20">
      
      {/* ── Top Header Section ── */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
        
        {/* Top Profile / Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 border.5 border-gray-300 rounded-none bg-white hover:bg-gray-100 text-gray-800 transition-colors shadow-2xs"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo.webp"
                alt="Western Bakery"
                className="w-10 h-10 object-cover rounded-none border border-gray-200 bg-white"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div>
                <h3 className="font-bold text-sm leading-tight text-gray-900">Mason Davis</h3>
                <p className="text-[11px] text-gray-500 font-medium">Welcome Back,</p>
              </div>
            </div>
          </div>

          <button className="p-2 border border-gray-300 rounded-none bg-white hover:bg-gray-100 text-gray-700 transition-colors relative shadow-2xs">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B]" />
          </button>
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-5">
          Discover, Delight, Devour: Your Perfect Cake is Here!
        </h1>

        {/* Search Bar */}
        <div className="relative mb-5">
          <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for Your Perfect Cake"
            className="w-full pl-11 pr-10 py-3 bg-[#E5E7EB]/70 border border-gray-300 text-sm text-gray-900 rounded-none focus:outline-none focus:bg-white focus:border-gray-400 transition-all placeholder:text-gray-400 font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Badges / Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {cakeCategoryNames.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-2 px-4.5 text-xs font-bold whitespace-nowrap rounded-none border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-sm scale-102'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* ── Cake Grid Section ── */}
        {loading && (
          <div className="text-center py-16 text-gray-400 text-xs tracking-widest animate-pulse font-medium">
            Loading Cake Collection...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-200 p-8 rounded-none">
            <p className="text-gray-500 text-sm font-medium">No cakes found matching your selection.</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-3 text-xs text-[#FF6B6B] underline font-semibold">
                Clear Search Filter
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filtered.map((item, index) => (
            <div
              key={item._id || index}
              onClick={() => setSelectedItem(item)}
              className="bg-white border border-gray-200/90 rounded-none overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Image Container */}
              <div className="w-full aspect-[4/3] sm:aspect-square bg-gray-100 overflow-hidden relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🎂</div>
                )}
                
                {/* Favorite Heart Badge */}
                <button
                  onClick={(e) => toggleFavorite(e, item._id)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-gray-600 hover:text-[#FF6B6B] transition-colors shadow-xs"
                >
                  <Heart
                    size={14}
                    className={favorites[item._id] ? 'fill-[#FF6B6B] text-[#FF6B6B]' : ''}
                  />
                </button>

                {/* Rating Badge */}
                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-none flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span>{item.rating || '4.9'}</span>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-white">
                <h2 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-2 leading-tight group-hover:text-[#FF6B6B] transition-colors">
                  {item.name}
                </h2>

                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="font-extrabold text-sm sm:text-base text-gray-900">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </span>
                  <button
                    className="w-7 h-7 bg-[#FF6B6B] hover:bg-[#ff5252] text-white flex items-center justify-center rounded-full transition-all active:scale-90 shadow-sm"
                    title="View Cake Details"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cake Detail Modal ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-none border border-gray-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full h-64 bg-gray-100 relative">
              {selectedItem.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover rounded-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🎂</div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-none hover:bg-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-lg text-gray-900 leading-snug">
                  {selectedItem.name}
                </h3>
                <span className="font-extrabold text-xl text-[#FF6B6B] whitespace-nowrap">
                  ${typeof selectedItem.price === 'number' ? selectedItem.price.toFixed(2) : selectedItem.price}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {selectedItem.description || 'Handcrafted fresh cake made with premium bakery ingredients and finest chocolate.'}
              </p>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold text-xs rounded-none transition-colors uppercase tracking-wider"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
