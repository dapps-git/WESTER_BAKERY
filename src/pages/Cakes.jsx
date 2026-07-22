import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ArrowLeft, X } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DEMO_CAKES = [
  {
    _id: 'demo-1',
    name: 'Candyland Carnival Cake',
    category: { name: 'Birthday Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Decadent dark chocolate layers dripping with rich ganache, topped with fresh strawberries.',
  },
  {
    _id: 'demo-2',
    name: 'Rainbow Burst Gem Cake',
    category: { name: 'Custom Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant pink cream layers topped with sprinkles and a mini waffle cone accent.',
  },
  {
    _id: 'demo-3',
    name: 'Cherry Blossom Cake',
    category: { name: 'Birthday Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Delicate chocolate wafer crust filled with velvety cocoa sponge and festive sprinkles.',
  },
  {
    _id: 'demo-4',
    name: 'Cookie Dough Fudge Cake',
    category: { name: 'Wedding Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    description: 'Creamy chocolate rosettes layered over rich sponge cake with rainbow sugar crystals.',
  },
]

export default function Cakes() {
  const navigate = useNavigate()
  const [cakes, setCakes] = useState(DEMO_CAKES)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    ;(async () => {
      try {
        const pRes = await axios.get(`${API}/api/products`)
        const apiCakes = pRes.data.filter(p => p.category?.name?.toLowerCase() === 'cakes')
        if (apiCakes && apiCakes.length > 0) {
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

  const cakeCategories = ['All', 'Wedding', 'Birthday', 'Cupcakes', 'Custom']

  const filtered = cakes.filter(c => {
    const matchSrch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' ||
      c.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      c.category?.name?.toLowerCase().includes(activeCategory.toLowerCase())
    return matchSrch && matchCat
  })

  return (
    <div className="bg-[#FAF8F5] min-h-screen font-sans text-gray-900 overflow-hidden">
      
      {/* ── Fixed Sticky Navbar (Exact Food Menu Theme & Style) ── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 pt-3 pb-2">

          {/* Top row: back | centered title | search icon */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBack}
              className="p-1.5 rounded-none text-[#6a2e16] hover:bg-gray-100 transition-colors"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Center-aligned Title with Food Menu Theme */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-base leading-none mb-0.5">🎂</div>
              <h1 className="font-serif italic font-bold text-xl sm:text-2xl text-[#6a2e16] tracking-wider leading-none">
                Cake Menu
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-px w-5 bg-[#C8A27C]" />
                <span className="text-[#8C6239] text-[9px] font-serif">✦</span>
                <div className="h-px w-5 bg-[#C8A27C]" />
              </div>
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 rounded-none text-[#6a2e16] hover:bg-gray-100 transition-colors"
              title="Search"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Collapsible Search Input */}
          {searchOpen && (
            <div className="mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search cake menu..."
                  autoFocus
                  className="w-full pl-4 pr-10 py-1.5 bg-gray-50 border border-gray-200 rounded-none text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Chips inside Sticky Navbar */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {cakeCategories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`py-1.5 px-3.5 rounded-none text-center flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0 font-sans text-xs font-semibold tracking-tight whitespace-nowrap ${
                    isActive
                      ? 'bg-[#6a2e16] text-white shadow-sm border border-[#6a2e16]'
                      : 'bg-white text-gray-700 border border-gray-100 hover:border-[#C8A27C] hover:bg-[#FAF6F0] shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Scrollable Content (padded below fixed navbar) ── */}
      <div className="max-w-md mx-auto px-4 pb-12" style={{ paddingTop: searchOpen ? '168px' : '146px' }}>

        {/* Skeleton Loading Grid */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white border border-[#EDE8DE] rounded-none overflow-hidden flex flex-col justify-between animate-pulse">
                <div className="w-full aspect-[4/3] sm:aspect-square bg-gray-200/80" />
                <div className="p-3.5 sm:p-4 bg-white flex flex-col justify-center items-center gap-2">
                  <div className="h-4 bg-gray-200/80 rounded-none w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#EDE8DE] p-8 rounded-none">
            <p className="text-[#A87850] text-sm font-medium">No cakes found matching your search.</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-3 text-xs text-[#6a2e16] underline font-semibold">
                Clear Search
              </button>
            )}
          </div>
        )}


        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filtered.map((item, index) => (
            <div
              key={item._id || index}
              onClick={() => setSelectedItem(item)}
              className="bg-white border border-[#EDE8DE] rounded-none overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Top Image Container */}
              <div className="w-full aspect-[4/3] sm:aspect-square bg-[#F5EDE3] overflow-hidden relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-[#C8A27C]">🎂</div>
                )}
              </div>

              {/* Bottom Details */}
              <div className="p-3.5 sm:p-4 bg-white flex flex-col justify-center flex-1">
                <h2 className="font-serif font-semibold text-sm sm:text-base text-[#3D2712] line-clamp-2 leading-snug group-hover:text-[#6a2e16] transition-colors text-center">
                  {item.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cake Detail Modal ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(30,10,5,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-none border border-[#EDE8DE] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full h-64 bg-[#F5EDE3] relative">
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
              <div className="mb-2 text-center">
                <h3 className="font-serif text-lg font-bold text-[#3D2712] leading-snug">
                  {selectedItem.name}
                </h3>
              </div>
              <p className="text-xs text-[#A87850] font-sans leading-relaxed mb-4 text-center">
                {selectedItem.description || 'Handcrafted fresh cake made with premium bakery ingredients and finest chocolate.'}
              </p>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 bg-[#6a2e16] hover:bg-[#522310] text-white font-bold text-xs rounded-none transition-colors uppercase tracking-wider font-serif"
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
