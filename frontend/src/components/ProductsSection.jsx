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
  Coffee,
  UtensilsCrossed,
  Cookie,
  Utensils,
  Flame,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react'
import ImageWithSkeleton from './ImageWithSkeleton'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CATEGORY_PRIORITY_ORDER = [
  'birya',
  'biriya',
  'pizza',
  'shawarma',
  'snack',
  'sandwich',
  'burger',
  'fried',
  'alfham',
  'shawai',
  'fresh juice',
  'juice',
  'lime',
  'mojito',
  'tea',
  'coffee',
]

const getCatRank = (catName) => {
  const k = (catName || '').toLowerCase()
  const idx = CATEGORY_PRIORITY_ORDER.findIndex(key => k.includes(key))
  return idx !== -1 ? idx : 99
}

const getCategoryIcon = (name) => {
  const k = name.toLowerCase()
  if (k === 'all') return <UtensilsCrossed size={13} />
  if (k.includes('birya') || k.includes('biriya')) return <Utensils size={13} />
  if (k.includes('pizza')) return <Pizza size={13} />
  if (k.includes('burger')) return <Beef size={13} />
  if (k.includes('sandwich')) return <Sandwich size={13} />
  if (k.includes('fried')) return <Flame size={13} />
  if (k.includes('shawarma')) return <Utensils size={13} />
  if (k.includes('alfham') || k.includes('shawai') || k.includes('bbq')) return <Flame size={13} />
  if (k.includes('snack')) return <Cookie size={13} />
  if (k.includes('juice')) return <Coffee size={13} />
  if (k.includes('lime') || k.includes('mojito') || k.includes('drink')) return <Coffee size={13} />
  if (k.includes('tea') || k.includes('coffee')) return <Coffee size={13} />
  return <Utensils size={13} />
}

// All food items are loaded dynamically from MongoDB via the API

export default function ProductsSection() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [sortPrice, setSortPrice] = useState('none') // 'none' | 'asc' | 'desc'
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/categories`),
        ])
        const apiProducts = (pRes.data || []).filter(
          p => p.category?.name?.toLowerCase() !== 'cakes'
        )
        setProducts(apiProducts)

        if (cRes.data && cRes.data.length > 0) {
          const apiCats = cRes.data.filter(c => c.name.toLowerCase() !== 'cakes')
          apiCats.sort((a, b) => getCatRank(a.name) - getCatRank(b.name))
          setCategories(apiCats)
        }
      } catch {
        /* empty handler */
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Deduplicate strictly by lowercase name
  const seen = new Set()
  const uniqueProducts = products.filter(p => {
    const key = p.name.trim().toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const filtered = uniqueProducts
    .filter(p => {
      if (p.category?.name?.toLowerCase() === 'cakes') return false
      const matchCat = active === 'All' || p.category?.name === active
      const matchSrch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSrch
    })
    .sort((a, b) => {
      const getPrice = (item) => (item.options && item.options.length > 0 ? item.options[0].price : item.price || 0)
      if (sortPrice === 'asc') {
        return getPrice(a) - getPrice(b)
      }
      if (sortPrice === 'desc') {
        return getPrice(b) - getPrice(a)
      }
      // Default: Sort by Category Priority Order (Biryani -> Pizza -> Shawarma -> Snacks -> Drinks)
      return getCatRank(a.category?.name) - getCatRank(b.category?.name)
    })

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const openItemModal = (item) => {
    setSelectedItem(item)
    setSelectedSizeIdx(0)
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 overflow-hidden">

      {/* ── Fixed Sticky Navbar ──────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 pt-3 pb-2">

          {/* Top row: back | title | actions (price sort + search) */}
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

            <div className="flex items-center gap-1">
              {/* Price Sort Filter Button */}
              <button
                onClick={() => setSortPrice(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none')}
                title={sortPrice === 'none' ? 'Sort by Price' : sortPrice === 'asc' ? 'Price: Low to High' : 'Price: High to Low'}
                className={`px-2 py-1 rounded-full text-xs font-extrabold flex items-center gap-0.5 transition-all ${
                  sortPrice !== 'none'
                    ? 'bg-[#6a2e16] text-white shadow-xs'
                    : 'bg-gray-100 text-[#6a2e16] hover:bg-gray-200'
                }`}
              >
                <span>₹</span>
                {sortPrice === 'asc' && <ArrowUp size={12} />}
                {sortPrice === 'desc' && <ArrowDown size={12} />}
                {sortPrice === 'none' && <ArrowUpDown size={12} />}
              </button>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 rounded-full text-[#6a2e16] hover:bg-gray-100 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
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
                  className="w-full pl-4 pr-10 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-800 focus:outline-none focus:border-[#6a2e16]"
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
            {['All', ...categories.map(c => c.name)].map((cat) => {
              const isActive = active === cat
              return (
                <div
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`min-w-[52px] py-1.5 px-3 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shrink-0 ${
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

        {/* Skeleton Card List during initial fetch */}
        {loading ? (
          <div className="flex flex-col gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex bg-white rounded-2xl overflow-hidden border border-gray-100 p-1.5 animate-pulse"
              >
                <div className="w-[120px] sm:w-[140px] h-[95px] sm:h-[105px] rounded-xl bg-gray-200 shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1 px-3">
                  <div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded-md w-full mb-1" />
                    <div className="h-3 bg-gray-200 rounded-md w-1/2" />
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                    <div className="h-4 bg-gray-200 rounded-md w-12" />
                    <div className="h-4 bg-gray-200 rounded-full w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-gray-500 text-sm font-semibold">
              {search
                ? `No results for "${search}"`
                : active !== 'All'
                  ? `No items in "${active}" yet`
                  : 'No menu items available'}
            </p>
            {(search || active !== 'All') && (
              <button
                onClick={() => { setSearch(''); setActive('All') }}
                className="mt-3 text-xs font-bold text-[#6a2e16] underline"
              >
                Show all items
              </button>
            )}
          </div>

        ) : (
          /* Product Card List */
          <div className="flex flex-col gap-2.5">
            {filtered.map((item, index) => {
              const displayPrice = item.options ? item.options[0].price : item.price
              const hasOptions = item.options && item.options.length > 0

              return (
                <div
                  key={item._id || index}
                  onClick={() => openItemModal(item)}
                  className="flex bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 cursor-pointer p-1.5 group"
                >
                  {/* Product Image */}
                  <div className="w-[120px] sm:w-[140px] h-[95px] sm:h-[105px] rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                    {item.imageUrl ? (
                      <ImageWithSkeleton
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        containerClassName="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🍽️</div>
                    )}

                    {item.category?.name && (
                      <span className="absolute top-1.5 left-1.5 z-10 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                        {item.category.name}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1 px-3">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 leading-snug group-hover:text-[#6a2e16] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-tight">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                      <span className="font-extrabold text-sm text-[#6a2e16]">
                        ₹{displayPrice} {hasOptions && <span className="text-[10px] text-gray-400 font-normal">({item.options[0].size})</span>}
                      </span>
                      <span className="text-[10px] font-bold text-[#6a2e16] bg-[#6a2e16]/10 px-2 py-0.5 rounded-full">
                        View
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Item Detail Modal ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full h-56 bg-gray-100 relative">
              {selectedItem.imageUrl ? (
                <ImageWithSkeleton
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <span className="text-[10px] font-bold text-[#6a2e16] uppercase tracking-widest bg-[#6a2e16]/10 px-2.5 py-0.5 rounded-full">
                {selectedItem.category?.name || 'Food Item'}
              </span>

              <h3 className="font-bold text-lg text-gray-900 mt-2 leading-snug">
                {selectedItem.name}
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed mt-1.5 mb-4">
                {selectedItem.description}
              </p>

              {/* Size Selector for Pizza */}
              {selectedItem.options && selectedItem.options.length > 0 && (
                <div className="mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Select Size:
                  </p>
                  <div className="flex gap-2">
                    {selectedItem.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSizeIdx(idx)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          selectedSizeIdx === idx
                            ? 'bg-[#6a2e16] text-white border-[#6a2e16] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <span className="block text-[10px] opacity-80">{opt.size}</span>
                        <span className="text-sm">₹{opt.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Price</span>
                  <span className="text-xl font-extrabold text-[#6a2e16]">
                    ₹{selectedItem.options ? selectedItem.options[selectedSizeIdx]?.price : selectedItem.price}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2.5 bg-[#6a2e16] text-white rounded-full font-bold text-xs hover:bg-[#522310] transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
