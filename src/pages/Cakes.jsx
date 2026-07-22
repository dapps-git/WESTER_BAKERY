import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ArrowLeft, X, Plus, Bell } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Cakes() {
  const navigate = useNavigate()
  const [cakes, setCakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    ;(async () => {
      try {
        const [pRes] = await Promise.all([
          axios.get(`${API}/api/products`),
        ])
        setCakes(pRes.data.filter(p => p.category?.name?.toLowerCase() === 'cakes'))
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

  const cakeCategoryNames = ['All', 'Wedding Cakes', 'Birthday Cakes', 'Cupcakes', 'Custom Cakes']

  const filtered = cakes.filter(c => {
    const matchSrch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' ||
      c.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      c.category?.name === activeCategory
    return matchSrch && matchCat
  })

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans text-gray-900 pb-16">
      
      {/* ── Header Container ── */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
        
        {/* Top Profile / Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 border border-gray-300 rounded-none bg-white hover:bg-gray-100 text-gray-800 transition-colors"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo.webp"
                alt="Western Bakery"
                className="w-9 h-9 object-cover rounded-none border border-gray-200 bg-white"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div>
                <h3 className="font-bold text-sm leading-tight text-gray-900">Western Bakery</h3>
                <p className="text-xs text-gray-500">Welcome Back,</p>
              </div>
            </div>
          </div>

          <button className="p-2 border border-gray-300 rounded-none bg-white hover:bg-gray-100 text-gray-700 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B6B]" />
          </button>
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-5">
          Discover, Delight, Devour: Your Perfect Cake is Here!
        </h1>

        {/* Search Bar */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for Your Perfect Cake"
            className="w-full pl-11 pr-10 py-3 bg-[#E5E7EB]/70 border border-gray-300 text-sm text-gray-900 rounded-none focus:outline-none focus:bg-white focus:border-gray-400 transition-colors"
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
                className={`py-2 px-4 text-xs font-semibold whitespace-nowrap rounded-none border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF6B6B] text-white border-[#FF6B6B] shadow-sm'
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filtered.map((item, index) => (
            <div
              key={item._id || index}
              onClick={() => setSelectedItem(item)}
              className="bg-white border border-gray-200 rounded-none overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              {/* Top Image */}
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
              </div>

              {/* Bottom Details */}
              <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                <h2 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-2 leading-tight">
                  {item.name}
                </h2>

                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="font-extrabold text-sm sm:text-base text-gray-900">
                    ₹{item.price}
                  </span>
                  <button
                    className="w-7 h-7 bg-[#FF6B6B] hover:bg-[#ff5252] text-white flex items-center justify-center rounded-full transition-transform active:scale-95 shadow-sm"
                    title="View Details"
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
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-none border border-gray-300 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full h-60 bg-gray-100 relative">
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
                <span className="font-extrabold text-lg text-[#FF6B6B] whitespace-nowrap">
                  ₹{selectedItem.price}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {selectedItem.description || 'Handcrafted fresh cake made with premium bakery ingredients.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
