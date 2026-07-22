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
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getCategoryIcon = (name) => {
  const k = name.toLowerCase()
  if (k === 'all') return <UtensilsCrossed size={13} />
  if (k.includes('pizza')) return <Pizza size={13} />
  if (k.includes('burger')) return <Beef size={13} />
  if (k.includes('sandwich')) return <Sandwich size={13} />
  if (k.includes('fried')) return <Flame size={13} />
  if (k.includes('shawarma')) return <Utensils size={13} />
  if (k.includes('snack')) return <Cookie size={13} />
  if (k.includes('drink') || k.includes('beverage') || k.includes('lime')) return <Coffee size={13} />
  return <Utensils size={13} />
}

const DEMO_FOOD = [
  // ── SNACKS ──
  {
    _id: 'f-1',
    name: 'Egg Puffs',
    price: 25,
    category: { name: 'Snacks' },
    imageUrl: '/food/eggpuffs.png',
    description: 'Freshly baked golden flaky puff pastry stuffed with spiced egg masala.',
  },
  {
    _id: 'f-2',
    name: 'Veg Puffs',
    price: 20,
    category: { name: 'Snacks' },
    imageUrl: '/food/vegpuffs.jpg',
    description: 'Flaky baked puff filled with delicious spiced potato and mixed vegetable filling.',
  },
  {
    _id: 'f-3',
    name: 'Chicken Puffs',
    price: 35,
    category: { name: 'Snacks' },
    imageUrl: '/food/chickenpuffs.png',
    description: 'Crispy layered pastry packed with juicy, spiced chicken filling.',
  },
  {
    _id: 'f-4',
    name: 'Veg Cutlet',
    price: 50,
    category: { name: 'Snacks' },
    imageUrl: '/food/vegcutlet.jpg',
    description: 'Crispy deep-fried mashed vegetable cutlet seasoned with aromatic spices.',
  },
  {
    _id: 'f-5',
    name: 'Chicken Cutlet',
    price: 20,
    category: { name: 'Snacks' },
    imageUrl: '/food/chickencutlet.webp',
    description: 'Tender minced chicken cutlet coated in breadcrumbs and fried to golden perfection.',
  },
  {
    _id: 'f-6',
    name: 'Chicken Roll',
    price: 35,
    category: { name: 'Snacks' },
    imageUrl: '/food/chickenroll.webp',
    description: 'Savory fried roll stuffed with shredded chicken masala and herbs.',
  },
  {
    _id: 'f-7',
    name: 'Glazed Donut',
    price: 15,
    category: { name: 'Snacks' },
    imageUrl: '/food/donut.webp',
    description: 'Soft, fluffy golden glazed donut topped with sweet cocoa glaze.',
  },

  // ── SANDWICH ──
  {
    _id: 'f-8',
    name: 'Chicken Sandwich',
    price: 90,
    category: { name: 'Sandwich' },
    imageUrl: '/food/chickensandwich.webp',
    description: 'Toasted triple layered sandwich filled with shredded chicken, mayo, and fresh veggies.',
  },
  {
    _id: 'f-9',
    name: 'Veg Sandwich',
    price: 60,
    category: { name: 'Sandwich' },
    imageUrl: '/food/vegsandwich.jpg',
    description: 'Classic grilled sandwich packed with fresh cucumber, tomato, and mint chutney.',
  },
  {
    _id: 'f-10',
    name: 'Omelette Sandwich',
    price: 70,
    category: { name: 'Sandwich' },
    imageUrl: '/food/omlettesandwich.webp',
    description: 'Fluffy spiced egg omelette stuffed between toasted buttered bread slices.',
  },

  // ── BURGER ──
  {
    _id: 'f-11',
    name: 'Veg Burger',
    price: 80,
    category: { name: 'Burger' },
    imageUrl: '/food/vegburger.webp',
    description: 'Crispy vegetable patty topped with lettuce, onions, and creamy mayo in a soft toasted bun.',
  },
  {
    _id: 'f-12',
    name: 'Chicken Burger',
    price: 100,
    category: { name: 'Burger' },
    imageUrl: '/food/chickenburger.webp',
    description: 'Juicy chicken patty layered with cheddar cheese, fresh lettuce, and house burger sauce.',
  },

  // ── FRIED CHICKEN ──
  {
    _id: 'f-13',
    name: 'Fried Chicken (2 Pieces)',
    price: 140,
    category: { name: 'Fried Chicken' },
    imageUrl: '/food/fried2.webp',
    description: '2 pieces of crispy, golden, spicy fried chicken served hot.',
  },
  {
    _id: 'f-14',
    name: 'Fried Chicken (5 Pieces)',
    price: 300,
    category: { name: 'Fried Chicken' },
    imageUrl: '/food/fried5.avif',
    description: '5 pieces of juicy and crispy fried chicken served with garlic dip.',
  },
  {
    _id: 'f-15',
    name: 'Fried Chicken (9 Pieces)',
    price: 500,
    category: { name: 'Fried Chicken' },
    imageUrl: '/food/fried9.webp',
    description: '9 pieces family bucket of hot & crispy fried chicken.',
  },

  // ── SHAWARMA ──
  {
    _id: 'f-16',
    name: 'Shawarma Roll',
    price: 90,
    category: { name: 'Shawarma' },
    imageUrl: '/food/shawarmaroll.webp',
    description: 'Classic Arabic chicken shawarma wrapped in soft rumali bread with garlic sauce.',
  },
  {
    _id: 'f-17',
    name: 'Shawarma Plate',
    price: 110,
    category: { name: 'Shawarma' },
    imageUrl: '/food/shawarmaplate.webp',
    description: 'Juicy shredded chicken shawarma served on a plate with kubbus, french fries, and garlic dip.',
  },
  {
    _id: 'f-18',
    name: 'Shawarma Special Roll',
    price: 110,
    category: { name: 'Shawarma' },
    imageUrl: '/food/shawarmasproll.webp',
    description: 'Extra loaded chicken shawarma roll stuffed with extra meat and double garlic sauce.',
  },
  {
    _id: 'f-19',
    name: 'Shawarma Special Plate',
    price: 130,
    category: { name: 'Shawarma' },
    imageUrl: '/food/shawarmaspplate.webp',
    description: 'Premium loaded chicken shawarma plate served with extra meat, cheese, fries, and dips.',
  },

  // ── PIZZA ──
  {
    _id: 'f-20',
    name: 'Chicken Pizza',
    category: { name: 'Pizza' },
    imageUrl: '/food/chickenpizza.jpg',
    description: 'Mozzarella cheese pizza topped with seasoned chicken, onions, and capsicum.',
    options: [
      { size: 'Small', price: 230 },
      { size: 'Big', price: 300 },
    ],
  },
  {
    _id: 'f-21',
    name: 'Veg Pizza',
    category: { name: 'Pizza' },
    imageUrl: '/food/vegpizza.jpg',
    description: 'Fresh sourdough pizza loaded with mozzarella cheese, tomatoes, sweet corn, and olives.',
    options: [
      { size: 'Small', price: 170 },
      { size: 'Big', price: 250 },
    ],
  },

  // ── DRINKS ──
  {
    _id: 'f-22',
    name: 'Fresh Lime',
    price: 20,
    category: { name: 'Drinks' },
    imageUrl: '/drinks/freshlime.jpg',
    description: 'Chilled refreshing fresh lime juice made with real lemons and fresh mint leaves.',
  },
  {
    _id: 'f-23',
    name: 'Grape Lime',
    price: 30,
    category: { name: 'Drinks' },
    imageUrl: '/drinks/grapelime.jpg',
    description: 'Cool lime juice blended with sweet black grape flavor.',
  },
  {
    _id: 'f-24',
    name: 'Blue Lime Cooler',
    price: 40,
    category: { name: 'Drinks' },
    imageUrl: '/drinks/bluelime.jpg',
    description: 'Exotic blue curacao lime cooler served ice cold.',
  },
  {
    _id: 'f-25',
    name: 'Pineapple Lime',
    price: 30,
    category: { name: 'Drinks' },
    imageUrl: '/drinks/pineapplelime.webp',
    description: 'Tropical fresh pineapple juice infused with a tangy twist of fresh lime.',
  },
]

export default function ProductsSection() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(DEMO_FOOD)
  const [categories, setCategories] = useState([
    { _id: 'cat-1', name: 'Snacks' },
    { _id: 'cat-2', name: 'Sandwich' },
    { _id: 'cat-3', name: 'Burger' },
    { _id: 'cat-4', name: 'Fried Chicken' },
    { _id: 'cat-5', name: 'Shawarma' },
    { _id: 'cat-6', name: 'Pizza' },
    { _id: 'cat-7', name: 'Drinks' },
  ])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/categories`),
        ])
        if (pRes.data && pRes.data.length > 0) {
          const apiProducts = pRes.data.filter(p => p.category?.name?.toLowerCase() !== 'cakes')
          setProducts([...apiProducts, ...DEMO_FOOD])
        }
        if (cRes.data && cRes.data.length > 0) {
          const apiCats = cRes.data.filter(c => c.name.toLowerCase() !== 'cakes')
          setCategories(apiCats)
        }
      } catch {
        /* fallback to demo items */
      }
    })()
  }, [])

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

  const openItemModal = (item) => {
    setSelectedItem(item)
    setSelectedSizeIdx(0)
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

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm font-medium">No menu items found.</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-2 text-xs text-[#6a2e16] underline font-semibold">
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Product Card List */}
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
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🍽️</div>
                  )}

                  {item.category?.name && (
                    <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
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
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
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
