import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Search,
  ArrowLeft,
  X,
  Pizza,
  Beef,
  Sandwich,
  IceCream,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Soup,
  Utensils,
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Helper to map category names to smaller, clean icons
const getCategoryIcon = (name) => {
  const k = name.toLowerCase()
  if (k === 'all') return <UtensilsCrossed size={13} />
  if (k.includes('pizza')) return <Pizza size={13} />
  if (k.includes('burger')) return <Beef size={13} />
  if (k.includes('sandwich')) return <Sandwich size={13} />
  if (k.includes('pasta')) return <Utensils size={13} />
  if (k.includes('rice') || k.includes('biryani')) return <Soup size={13} />
  if (k.includes('snack')) return <Cookie size={13} />
  if (k.includes('drink') || k.includes('beverage') || k.includes('coffee')) return <Coffee size={13} />
  if (k.includes('dessert') || k.includes('pastr') || k.includes('cake')) return <IceCream size={13} />
  return <Utensils size={13} />
}

export default function ProductsSection() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    ; (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/categories`),
        ])
        setProducts(pRes.data)
        setCategories(cRes.data)
      } catch {
        /* silent */
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* Cakes are shown in their own dedicated page */
  const visibleCats = categories.filter(c => c.name.toLowerCase() !== 'cakes')

  const filtered = products.filter(p => {
    if (p.category?.name?.toLowerCase() === 'cakes') return false
    const matchCat = active === 'All' || p.category?.name === active
    const matchSrch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSrch
  })

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 pb-12">
      <div className="max-w-md mx-auto px-4 pt-4">

        {/* ── Top Header ─────────────────────────────────── */}
        <header className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="p-1.5 rounded-full text-[#6a2e16] hover:bg-brown-50 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="flex flex-col items-center">
            <div className="text-xl leading-none mb-0.5">👨‍🍳</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6a2e16] tracking-wider italic leading-none">
              Food Menu
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-px w-6 bg-[#C8A27C]" />
              <span className="text-[#8C6239] text-[10px] font-serif">⚔</span>
              <div className="h-px w-6 bg-[#C8A27C]" />
            </div>
          </div>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 rounded-full text-[#6a2e16] hover:bg-brown-50 transition-colors"
          >
            <Search size={22} />
          </button>
        </header>

        {/* ── Search Bar Toggle ────────────────────────────── */}
        {searchOpen && (
          <div className="mb-4 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search menu..."
                autoFocus
                className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Categories Bar (Warm Brown Theme) ──────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {['All', ...visibleCats.map(c => c.name)].map((cat) => {
            const isActive = active === cat
            return (
              <div
                key={cat}
                onClick={() => setActive(cat)}
                className={`min-w-[56px] sm:min-w-[64px] py-1.5 px-2 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isActive
                  ? 'bg-[#6a2e16] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-gray-200'
                  }`}
              >
                <div className={isActive ? 'text-white' : 'text-[#6a2e16]'}>
                  {getCategoryIcon(cat)}
                </div>
                <span className="block mt-0.5 text-[10px] font-semibold tracking-tight whitespace-nowrap">
                  {cat}
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Loading State ───────────────────────────────── */}
        {loading && (
          <div className="text-center py-12 text-gray-400 text-xs tracking-widest animate-pulse font-medium">
            Loading Menu...
          </div>
        )}

        {/* ── Empty State ─────────────────────────────────── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm font-medium">No menu items found.</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-2 text-xs text-[#6a2e16] underline font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* ── Products List — Wide Landscape Rectangle Photos ──────── */}
        <div className="flex flex-col gap-2">
          {filtered.map((item, index) => (
            <div
              key={item._id || index}
              className="flex bg-white rounded-2xl overflow-hidden border border-gray-100/90 shadow-[0_4px_16px_rgba(0,0,0,0.05)] cursor-pointer group hover:shadow-md transition-all duration-200"
              style={{
                animationDelay: `${index * 30}ms`,
                animation: 'fadeInUp 0.35s ease-out forwards',
                opacity: 0,
              }}
            >
              {/* Wide Landscape Rectangle Image */}
              <div className="w-[145px] sm:w-[175px] h-[92px] sm:h-[105px] shrink-0 overflow-hidden rounded-xl m-1.5 bg-gray-50">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                    🥐
                  </div>
                )}
              </div>

              {/* Product Details on Right: Name Left, Price Far Right */}
              <div className="flex-1 flex justify-between items-center px-3 sm:px-4 py-2 min-w-0">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#3D2712] line-clamp-2 pr-2">
                  {item.name}
                </h3>
                <span className="text-[#6a2e16] text-base sm:text-xl font-extrabold whitespace-nowrap">
                  ₹{item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
