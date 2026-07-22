import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ArrowLeft, X } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DEMO_CAKES = [
  {
    _id: 'demo-1',
    name: 'Candyland Carnival Cake',
    price: 450,
    category: { name: 'Birthday Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Decadent dark chocolate layers dripping with rich ganache, topped with fresh strawberries.',
  },
  {
    _id: 'demo-2',
    name: 'Rainbow Burst Gem Cake',
    price: 380,
    category: { name: 'Custom Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant pink cream layers topped with sprinkles and a mini waffle cone accent.',
  },
  {
    _id: 'demo-3',
    name: 'Cherry Blossom Cake',
    price: 480,
    category: { name: 'Birthday Cakes' },
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Delicate chocolate wafer crust filled with velvety cocoa sponge and festive sprinkles.',
  },
  {
    _id: 'demo-4',
    name: 'Cookie Dough Fudge Cake',
    price: 550,
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

  const cakeCategories = [
    { name: 'All', icon: '✨' },
    { name: 'Wedding Cakes', icon: '💍' },
    { name: 'Birthday Cakes', icon: '🎉' },
    { name: 'Cupcakes', icon: '🧁' },
    { name: 'Custom Cakes', icon: '🎨' },
  ]

  const filtered = cakes.filter(c => {
    const matchSrch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' ||
      c.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      c.category?.name === activeCategory
    return matchSrch && matchCat
  })

  return (
    <div className="bg-[#FAF8F5] min-h-screen font-sans text-gray-900 pb-20">
      
      {/* ── Top Header Section ── */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleBack}
            className="p-2 border border-[#EDE8DE] rounded-none bg-white hover:bg-[#FAF6F0] text-[#5C3A21] transition-colors"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Center-aligned Italic Title (Same as Food Menu) */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg leading-none mb-0.5">🎂</div>
            <h1 className="font-serif italic font-bold text-xl sm:text-2xl text-[#6a2e16] tracking-wider leading-none">
              Cake Menu
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-px w-5 bg-[#C8A27C]" />
              <span className="text-[#8C6239] text-[9px] font-serif">✦</span>
              <div className="h-px w-5 bg-[#C8A27C]" />
            </div>
          </div>

          <div className="w-9" /> {/* Spacer for symmetry */}
        </div>

        {/* Search Bar */}
        <div className="relative my-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A87850]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for your favorite cake..."
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-[#DED6C8] text-sm text-[#3D2712] rounded-none focus:outline-none focus:border-[#6a2e16] transition-all placeholder:text-[#A87850]/60 font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A87850] hover:text-[#6a2e16]">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Pretty & Elegant Category Section */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {cakeCategories.map((cat) => {
            const isActive = activeCategory === cat.name
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`py-2 px-4 text-xs font-semibold whitespace-nowrap rounded-none transition-all duration-200 flex items-center gap-1.5 border shrink-0 ${
                  isActive
                    ? 'bg-[#6a2e16] text-white border-[#6a2e16] shadow-sm'
                    : 'bg-white text-[#5C3A21] border-[#EDE8DE] hover:border-[#C8A27C] hover:bg-[#FAF6F0]'
                }`}
              >
                <span className="text-xs">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* ── Cake Grid Section ── */}
        {loading && (
          <div className="text-center py-16 text-[#A87850] text-xs tracking-widest animate-pulse font-medium">
            Loading Cake Collection...
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

              {/* Bottom Details (Same typography as Food Menu) */}
              <div className="p-3.5 sm:p-4 bg-white flex flex-col justify-between flex-1">
                <h2 className="font-serif font-semibold text-sm sm:text-base text-[#3D2712] line-clamp-2 mb-1.5 leading-snug group-hover:text-[#6a2e16] transition-colors">
                  {item.name}
                </h2>

                <div className="font-serif font-extrabold text-sm sm:text-base text-[#6a2e16] mt-auto pt-1">
                  ₹{item.price}
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
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-serif text-lg font-bold text-[#3D2712] leading-snug">
                  {selectedItem.name}
                </h3>
                <span className="font-serif text-xl font-extrabold text-[#6a2e16] whitespace-nowrap">
                  ₹{selectedItem.price}
                </span>
              </div>
              <p className="text-xs text-[#A87850] font-sans leading-relaxed mb-4">
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
