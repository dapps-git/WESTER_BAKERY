import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ArrowLeft, X } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CUSTOM_STATIC_CAKES = [
  { _id: 'cust-1', imageUrl: '/custom/1.avif', category: { name: 'Custom' } },
  { _id: 'cust-2', imageUrl: '/custom/3.avif', category: { name: 'Custom' } },
  { _id: 'cust-3', imageUrl: '/custom/9.avif', category: { name: 'Custom' } },
  { _id: 'cust-4', imageUrl: '/custom/10.avif', category: { name: 'Custom' } },
  { _id: 'cust-5', imageUrl: '/custom/17.avif', category: { name: 'Custom' } },
  { _id: 'cust-6', imageUrl: '/custom/1000796798.jpg.jpeg', category: { name: 'Custom' } },
  { _id: 'cust-7', imageUrl: '/custom/1000805921.jpg.jpeg', category: { name: 'Custom' } },
  { _id: 'cust-8', imageUrl: '/cake1.png', category: { name: 'Custom' } },
  { _id: 'cust-9', imageUrl: '/cake2.png', category: { name: 'Custom' } },
  { _id: 'cust-10', imageUrl: '/cake3.png', category: { name: 'Custom' } },
  { _id: 'cust-11', imageUrl: '/cake4.png', category: { name: 'Custom' } },
  { _id: 'cust-12', imageUrl: '/cake5.png', category: { name: 'Custom' } },
]

const DEMO_MENU_CAKES = [
  {
    _id: 'c-1',
    name: 'Black Forest Cake',
    category: { name: 'Chocolate' },
    imageUrl: '/cakes/blackforest.png',
    description: 'Classic moist chocolate sponge layered with fresh whipped cream and juicy cherries, topped with dark chocolate curls.',
    prices: [
      { weight: '500g', price: 300 },
      { weight: '1 kg', price: 600 },
    ],
  },
  {
    _id: 'c-2',
    name: 'White Forest Cake',
    category: { name: 'Vanilla' },
    imageUrl: '/cakes/whiteforest.png',
    description: 'Fluffy vanilla sponge cake layered with white chocolate shavings, red cherries, and velvety whipped cream.',
    prices: [
      { weight: '500g', price: 300 },
      { weight: '1 kg', price: 600 },
    ],
  },
  {
    _id: 'c-3',
    name: 'Oreo Cream Cake',
    category: { name: 'Chocolate' },
    imageUrl: '/cakes/oreocake.jpeg',
    description: 'Decadent chocolate sponge layered with crushed Oreo cookie cream and topped with whole Oreo biscuits.',
    prices: [
      { weight: '500g', price: 600 },
    ],
  },
  {
    _id: 'c-4',
    name: 'Ferrero Rocher Cake',
    category: { name: 'Premium' },
    imageUrl: '/cakes/ferroro.jpeg',
    description: 'Luxurious hazelnut chocolate cake loaded with real Ferrero Rocher chocolates, Nutella glaze, and roasted hazelnut crunch.',
    prices: [
      { weight: '1 kg', price: 1450 },
    ],
  },
  {
    _id: 'c-5',
    name: 'Pistachio Chocolate Cake',
    category: { name: 'Premium' },
    imageUrl: '/cakes/pistachiocake.jpeg',
    description: 'Rich dark chocolate cake infused with creamy pistachio mousse and crushed roasted pistachios.',
    prices: [
      { weight: '1 kg', price: 1400 },
    ],
  },
  {
    _id: 'c-6',
    name: 'Tender Coconut Cake',
    category: { name: 'Specialty' },
    imageUrl: '/cakes/tendercoconutcake.jpeg',
    description: 'Fresh and light coconut sponge infused with real tender coconut pulp and soft vanilla cream.',
    prices: [
      { weight: '1 kg', price: 1400 },
    ],
  },
  {
    _id: 'c-7',
    name: 'Dutch Chocolate Cake',
    category: { name: 'Chocolate' },
    imageUrl: '/cakes/dutchchoclatecake.jpeg',
    description: 'Deep, rich cocoa layers made with premium Dutch dark cocoa and silky chocolate fudge frosting.',
    prices: [
      { weight: '1 kg', price: 1000 },
    ],
  },
  {
    _id: 'c-8',
    name: 'Choco Butter Cake',
    category: { name: 'Chocolate' },
    imageUrl: '/cakes/chocobutterctc.jpeg',
    description: 'Moist golden butter cake layered with rich chocolate buttercream and chocolate drippings.',
    prices: [
      { weight: '1 kg', price: 1100 },
    ],
  },
  {
    _id: 'c-9',
    name: 'Chocolate Coffee Cake',
    category: { name: 'Chocolate' },
    imageUrl: '/cakes/chocolatecoffecake.jpeg',
    description: 'Perfect harmony of espresso coffee-infused sponge and rich dark chocolate ganache.',
    prices: [
      { weight: '1 kg', price: 900 },
    ],
  },
  {
    _id: 'c-10',
    name: 'Caramel Nuts Cake',
    category: { name: 'Nuts & Caramel' },
    imageUrl: '/cakes/caramelnuts.jpeg',
    description: 'Butterscotch sponge layered with golden salted caramel sauce and crunchy roasted cashews and almonds.',
    prices: [
      { weight: '500g', price: 480 },
      { weight: '1 kg', price: 900 },
    ],
  },
  {
    _id: 'c-11',
    name: 'Passion Fruit Cake',
    category: { name: 'Fruit' },
    imageUrl: '/cakes/passionfruitcake.jpeg',
    description: 'Refreshing tropical passion fruit curd layered between soft vanilla sponges and light cream.',
    prices: [
      { weight: '1 kg', price: 800 },
    ],
  },
  {
    _id: 'c-12',
    name: 'Spanish Delight Cake',
    category: { name: 'Specialty' },
    imageUrl: '/cakes/carml.png',
    description: 'Famous Spanish delight cake layered with rich custard, chocolate sauce, and toasted nuts.',
    prices: [
      { weight: '500g', price: 400 },
      { weight: '1 kg', price: 780 },
    ],
  },
  {
    _id: 'c-13',
    name: 'Pineapple Delight Cake',
    category: { name: 'Fruit' },
    imageUrl: '/cakes/pineaappledelight.jpg',
    description: 'Light, juicy vanilla cake filled with fresh chopped pineapples and sweet pineapple glaze.',
    prices: [
      { weight: '500g', price: 480 },
      { weight: '1 kg', price: 780 },
    ],
  },
  {
    _id: 'c-14',
    name: 'Blueberry Cake',
    category: { name: 'Fruit' },
    imageUrl: '/cakes/blueberry.png',
    description: 'Soft vanilla sponge layered with real blueberry compote and light whipped cream.',
    prices: [
      { weight: '500g', price: 400 },
      { weight: '1 kg', price: 780 },
    ],
  },
  {
    _id: 'c-15',
    name: 'Red Velvet Cake',
    category: { name: 'Red Velvet' },
    imageUrl: '/cakes/reveltv.jpg',
    description: 'Classic crimson red velvet cake with velvety cream cheese frosting.',
    prices: [
      { weight: '500g', price: 400 },
      { weight: '1 kg', price: 780 },
    ],
  },
  {
    _id: 'c-16',
    name: 'Honey Almond Cake',
    category: { name: 'Nuts & Caramel' },
    imageUrl: '/cakes/honeyalmoncake.jpeg',
    description: 'Sweet honey-infused cake encrusted with roasted sliced almonds and honey glaze.',
    prices: [
      { weight: '1 kg', price: 950 },
    ],
  },
  {
    _id: 'c-17',
    name: 'KitKat Chocolate Cake',
    category: { name: 'Chocolate' },
    imageUrl: '/cakes/kitkatcake.jpeg',
    description: 'Chocolate cake surrounded by crispy KitKat bars and topped with colorful chocolate gems.',
    prices: [
      { weight: '1 kg', price: 1200 },
    ],
  },
  {
    _id: 'c-18',
    name: 'Strawberry Delight Cake',
    category: { name: 'Fruit' },
    imageUrl: '/cakes/strwaberrydelight.jpeg',
    description: 'Fresh strawberry compote layered with fluffy vanilla sponge and whipped cream.',
    prices: [
      { weight: '500g', price: 400 },
      { weight: '1 kg', price: 780 },
    ],
  },
]

export default function Cakes() {
  const navigate = useNavigate()
  const [cakes, setCakes] = useState(DEMO_MENU_CAKES)
  const [customCakes, setCustomCakes] = useState(CUSTOM_STATIC_CAKES)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedWeightIdx, setSelectedWeightIdx] = useState(0)
  const [lightboxImg, setLightboxImg] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    ;(async () => {
      try {
        const pRes = await axios.get(`${API}/api/products`)
        if (pRes.data && pRes.data.length > 0) {
          const apiCakes = pRes.data.filter(p => p.category?.name?.toLowerCase() === 'cakes' || p.category?.name?.toLowerCase().includes('cake'))
          
          // Separate standard cakes vs custom cakes added via Admin Dashboard
          const apiCustom = apiCakes.filter(c => c.category?.name?.toLowerCase().includes('custom'))
          const apiStandard = apiCakes.filter(c => !c.category?.name?.toLowerCase().includes('custom'))

          if (apiCustom.length > 0) {
            setCustomCakes([...apiCustom, ...CUSTOM_STATIC_CAKES])
          }
          if (apiStandard.length > 0) {
            const formattedApiCakes = apiStandard.map(c => ({
              ...c,
              prices: c.prices || [{ weight: '1 kg', price: c.price || 600 }]
            }))
            setCakes([...formattedApiCakes, ...DEMO_MENU_CAKES])
          }
        }
      } catch {
        /* static fallbacks */
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

  const cakeCategories = ['All', 'Chocolate', 'Fruit', 'Premium', 'Specialty', 'Red Velvet', 'Nuts & Caramel', 'Custom']

  const filteredCakes = cakes.filter(c => {
    const matchSrch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' ||
      c.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      c.category?.name?.toLowerCase().includes(activeCategory.toLowerCase())
    return matchSrch && matchCat
  })

  const filteredCustom = customCakes.filter(c => {
    if (!search) return true
    return (c.name || '').toLowerCase().includes(search.toLowerCase())
  })

  const openCakeModal = (item) => {
    setSelectedItem(item)
    setSelectedWeightIdx(0)
  }

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
              <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                <div className="h-px w-5 bg-[#C8A27C]" />
                <span className="text-[#8C6239] text-[9px] font-serif">✦</span>
                <div className="h-px w-5 bg-[#C8A27C]" />
              </div>

              {/* View Customized Cakes Button */}
              <button
                onClick={() => setActiveCategory('Custom')}
                className={`py-0.5 px-2.5 text-[10px] font-bold rounded-full transition-all duration-200 border flex items-center gap-1 ${
                  activeCategory === 'Custom'
                    ? 'bg-[#6a2e16] text-white border-[#6a2e16] shadow-sm'
                    : 'bg-[#FAF6F0] text-[#6a2e16] border-[#C8A27C] hover:bg-[#6a2e16] hover:text-white'
                }`}
              >
                <span>✨</span>
                <span>View Customized Cakes</span>
              </button>
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
                  placeholder="Search cakes..."
                  autoFocus
                  className="w-full pl-4 pr-10 py-1.5 bg-gray-50 border border-gray-200 rounded-none text-base text-gray-800 focus:outline-none focus:border-[#6a2e16]"
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

      {/* ── Scrollable Content ── */}
      <div className="max-w-md mx-auto px-4 pb-12" style={{ paddingTop: searchOpen ? '192px' : '170px' }}>

        {/* ── CUSTOMIZED CAKES SECTION (PURE IMAGE GALLERY WITH FULL-SIZE LIGHTBOX) ── */}
        {activeCategory === 'Custom' ? (
          <div>
            <div className="text-center mb-4">
              <h2 className="font-serif italic font-bold text-lg text-[#6a2e16]">
                Customized Cake Gallery
              </h2>
              <p className="text-[11px] text-[#8C6239] font-medium mt-0.5">
                Tap any photo to view full size
              </p>
            </div>

            {filteredCustom.length === 0 && (
              <div className="text-center py-16 bg-white border border-[#EDE8DE] p-8 rounded-none">
                <p className="text-[#A87850] text-sm font-medium">No customized cakes found.</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {filteredCustom.map((item, index) => (
                <div
                  key={item._id || index}
                  onClick={() => setLightboxImg(item.imageUrl)}
                  className="aspect-square bg-gray-100 rounded-none overflow-hidden cursor-pointer group border border-[#EDE8DE] hover:border-[#6a2e16] transition-all duration-300 relative shadow-2xs"
                >
                  <img
                    src={item.imageUrl}
                    alt="Customized Cake"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/cake1.png'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/75 text-white text-[10px] font-bold px-2 py-1 rounded-none transition-opacity uppercase tracking-wider">
                      🔍 Full View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── STANDARD MENU CAKES GRID ── */
          <div>
            {filteredCakes.length === 0 && (
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
              {filteredCakes.map((item, index) => {
                const minPrice = item.prices ? Math.min(...item.prices.map(p => p.price)) : item.price
                const weightBadge = item.prices ? item.prices.map(p => p.weight).join(' / ') : ''

                return (
                  <div
                    key={item._id || index}
                    onClick={() => openCakeModal(item)}
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

                      {weightBadge && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-none">
                          {weightBadge}
                        </div>
                      )}
                    </div>

                    {/* Bottom Details */}
                    <div className="p-3 sm:p-3.5 bg-white flex flex-col justify-between flex-1 text-center">
                      <h2 className="font-serif font-semibold text-xs sm:text-sm text-[#3D2712] line-clamp-2 leading-snug group-hover:text-[#6a2e16] transition-colors mb-1">
                        {item.name}
                      </h2>
                      {minPrice && (
                        <div className="font-serif font-extrabold text-xs sm:text-sm text-[#6a2e16] mt-auto">
                          ₹{minPrice} {item.prices?.length > 1 ? <span className="text-[10px] text-gray-500 font-sans font-normal">(500g)</span> : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── FULL-SCREEN LIGHTBOX MODAL FOR CUSTOM CAKES ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-2 right-2 z-10 p-2.5 bg-black/75 text-white rounded-none hover:bg-black transition-colors"
              title="Close Full View"
            >
              <X size={22} />
            </button>
            <img
              src={lightboxImg}
              alt="Customized Cake Full View"
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-none border border-white/20"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* ── STANDARD CAKE DETAIL MODAL ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(30,10,5,0.65)', backdropFilter: 'blur(4px)' }}
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
              <div className="text-center mb-3">
                <span className="text-[10px] font-bold text-[#8C6239] uppercase tracking-widest bg-[#FAF6F0] px-2 py-0.5 border border-[#EDE8DE]">
                  {selectedItem.category?.name || 'Fresh Baked Cake'}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#3D2712] leading-snug mt-1.5">
                  {selectedItem.name}
                </h3>
              </div>

              <p className="text-xs text-[#666666] font-sans leading-relaxed mb-4 text-center">
                {selectedItem.description}
              </p>

              {selectedItem.prices && selectedItem.prices.length > 0 && (
                <div className="mb-5 bg-[#FAF8F5] p-3 border border-[#EDE8DE] rounded-none">
                  <p className="text-[11px] font-bold text-[#5C3A21] mb-2 text-center uppercase tracking-wider">
                    Select Weight & Price:
                  </p>
                  <div className="flex gap-2 justify-center">
                    {selectedItem.prices.map((pOpt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedWeightIdx(idx)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-none border transition-all ${
                          selectedWeightIdx === idx
                            ? 'bg-[#6a2e16] text-white border-[#6a2e16] shadow-sm'
                            : 'bg-white text-[#3D2712] border-[#EDE8DE] hover:border-[#C8A27C]'
                        }`}
                      >
                        <span className="block text-[10px] opacity-80">{pOpt.weight}</span>
                        <span className="text-sm font-serif">₹{pOpt.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 bg-[#6a2e16] hover:bg-[#522310] text-white font-bold text-xs rounded-none transition-colors uppercase tracking-wider font-serif shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
