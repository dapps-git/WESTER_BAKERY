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

const DEMO_FOOD = [
  {
    _id: 'food-1',
    name: 'Special Gourmet Western Burger',
    price: 180,
    category: { name: 'Burgers' },
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy double patty with melted cheddar, caramelised onions & house special sauce.',
  },
  {
    _id: 'food-2',
    name: 'Woodfired Pepperoni Pizza',
    price: 320,
    category: { name: 'Pizzas' },
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy sourdough base with smoked pepperoni, mozzarella & fresh basil.',
  },
  {
    _id: 'food-3',
    name: 'Creamy Penne Alfredo Pasta',
    price: 240,
    category: { name: 'Pasta' },
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6288924?auto=format&fit=crop&w=600&q=80',
    description: 'Italian penne tossed in rich garlic parmesan cream sauce.',
  },
  {
    _id: 'food-4',
    name: 'Crispy Chicken Club Sandwich',
    price: 160,
    category: { name: 'Sandwiches' },
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    description: 'Triple layered toasted bread with crispy fried chicken, lettuce & honey mustard.',
  },
]

export default function ProductsSection() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(DEMO_FOOD)
  const [categories, setCategories] = useState([
    { _id: 'c1', name: 'Burgers' },
    { _id: 'c2', name: 'Pizzas' },
    { _id: 'c3', name: 'Pasta' },
    { _id: 'c4', name: 'Sandwiches' },
  ])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/categories`),
        ])
        if (pRes.data && pRes.data.length > 0) {
          setProducts([...pRes.data, ...DEMO_FOOD])
        }
        if (cRes.data && cRes.data.length > 0) {
          setCategories(cRes.data)
        }
      } catch {
        /* fallback to static demo items */
      } finally {
        setLoading(false)
      }
    })()
  }, [])


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
    <div className="bg-white min-h-screen font-sans text-gray-900 overflow-hidden">

      {/* ── Fixed Sticky Navbar ──────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 pt-3 pb-2">

          {/* Top row: back | title | search */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBack}
              className="p-1.5 rounded-full text-[#6a2e16] hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex flex-col items-center">
              <div className="text-base leading-none mb-0.5">👨‍🍳</div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#6a2e16] tracking-wider italic leading-none">
                Food Menu
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-px w-5 bg-[#C8A27C]" />
                <span className="text-[#8C6239] text-[9px] font-serif">⚔</span>
                <div className="h-px w-5 bg-[#C8A27C]" />
              </div>
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 rounded-full text-[#6a2e16] hover:bg-gray-100 transition-colors"
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
                  placeholder="Search menu..."
                  autoFocus
                  className="w-full pl-4 pr-10 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {['All', ...visibleCats.map(c => c.name)].map((cat) => {
              const isActive = active === cat
              return (
                <div
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`min-w-[52px] py-1.5 px-2 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-[#6a2e16] text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
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
        </div>
      </div>

      {/* ── Scrollable Content (padded below fixed navbar) ── */}
      <div className="max-w-md mx-auto px-4 pb-12" style={{ paddingTop: searchOpen ? '170px' : '148px' }}>

        {/* Skeleton Loading List */}
        {loading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex bg-white rounded-2xl overflow-hidden border border-gray-100 p-1.5 animate-pulse">
                <div className="w-[145px] sm:w-[175px] h-[92px] sm:h-[105px] bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col justify-center px-4 gap-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}


        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm font-medium">No menu items found.</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-2 text-xs text-[#6a2e16] underline font-semibold">
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
              className="flex bg-white rounded-2xl overflow-hidden border border-gray-100/90 shadow-[0_4px_16px_rgba(0,0,0,0.05)] cursor-pointer group hover:shadow-md transition-all duration-200"
              style={{
                animationDelay: `${index * 30}ms`,
                animation: 'fadeInUp 0.35s ease-out forwards',
                opacity: 0,
              }}
            >
              {/* Image */}
              <div className="w-[145px] sm:w-[175px] h-[92px] sm:h-[105px] shrink-0 overflow-hidden rounded-xl m-1.5 bg-gray-50">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🥐</div>
                )}
              </div>

              {/* Info */}
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

      {/* ── Product Detail Modal ──────────────────────────── */}
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
            {/* Full-size product image */}
            <div className="w-full h-56 sm:h-64 overflow-hidden bg-gray-50 relative">
              {selectedItem.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">🥐</div>
              )}
              {/* Close button on image */}
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
                <span className="font-serif text-xl font-extrabold text-[#6a2e16] whitespace-nowrap">
                  ₹{selectedItem.price}
                </span>
              </div>

              {selectedItem.category?.name && (
                <span className="inline-block text-xs font-sans font-medium text-[#A87850] bg-[#FDF6EC] px-2.5 py-1 rounded-full border border-[#EDE0CA]">
                  {selectedItem.category.name}
                </span>
              )}

              {selectedItem.description && (
                <p className="mt-2 text-sm text-gray-500 font-sans leading-relaxed">
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
