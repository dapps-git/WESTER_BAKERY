import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Category image lookup table matching mockup categories
const CATEGORY_IMAGES = {
  pastries: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150&auto=format&fit=crop&q=60',
  breads: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=60',
  cookies: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=150&auto=format&fit=crop&q=60',
  cakes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=60',
  donuts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&auto=format&fit=crop&q=60',
  donughts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&auto=format&fit=crop&q=60',
  shawarma: 'https://images.unsplash.com/photo-1642683215881-c30c888d227f?w=150&auto=format&fit=crop&q=60',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=60',
  snacks: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=150&auto=format&fit=crop&q=60',
  beverages: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=150&auto=format&fit=crop&q=60',
  all: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=60',
  default: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=60'
}

// Category subtitles to match mockup (e.g. "Water included" for pastries)
const CATEGORY_SUBTITLES = {
  pastries: 'Water included',
  breads: 'Freshly baked daily',
  cookies: 'Sweet & crunchy',
  cakes: 'Artisan crafted slice',
  donuts: 'Glazed & sweet',
  donughts: 'Glazed & sweet',
  shawarma: 'Spiced & wrapped',
  biryani: 'Aromatic & hot',
  snacks: 'Crispy bites',
  beverages: 'Chilled & fresh',
  default: 'Freshly baked'
}

export default function ProductsSection() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)

  // Sort & Filter state
  const [sortBy, setSortBy] = useState('popularity')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/categories`),
        ])
        setProducts(pRes.data)
        setCategories(cRes.data)
      } catch {
        // backend not connected yet, use empty state
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getCategoryImage = (catName) => {
    const key = catName.toLowerCase()
    return CATEGORY_IMAGES[key] || CATEGORY_IMAGES.default
  }

  const getCategorySubtitle = (catName) => {
    const key = catName?.toLowerCase()
    return CATEGORY_SUBTITLES[key] || CATEGORY_SUBTITLES.default
  }

  // Filter out "Cakes" from category selector on homepage
  const filteredCategories = categories.filter(c => c.name.toLowerCase() !== 'cakes')

  // Filter products by category and search term, excluding Cakes
  const filteredAndSearched = products.filter(p => {
    const isCake = p.category?.name?.toLowerCase() === 'cakes'
    if (isCake) return false

    const matchesCategory = active === 'All' || p.category?.name === active
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Sort products
  const sorted = [...filteredAndSearched].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price
    }
    if (sortBy === 'price-high') {
      return b.price - a.price
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    return 0
  })

  return (
    <section id="products" className="py-24 bg-cream-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="section-subheading">Our Fresh Selection</p>
          <h2 className="section-heading">All Products</h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-brown-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-brown-300" />
            <div className="h-px w-16 bg-brown-200" />
          </div>
        </div>

        {/* Circular Category selector */}
        <div className="flex overflow-x-auto no-scrollbar gap-8 md:gap-12 justify-start md:justify-center mb-12 pb-4 border-b border-cream-200">
          {['All', ...filteredCategories.map(c => c.name)].map(cat => {
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="flex flex-col items-center min-w-[80px] group relative pb-3 focus:outline-none"
              >
                {/* Circular image thumbnail */}
                <div className={`w-16 h-16 rounded-full overflow-hidden mb-3 border-2 transition-all duration-300 bg-cream-100 flex items-center justify-center shadow-sm
                  ${isActive ? 'border-[#ef4444] scale-105 shadow' : 'border-transparent group-hover:border-brown-200 group-hover:scale-102'}`}
                >
                  <img
                    src={getCategoryImage(cat)}
                    alt={cat}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Label text */}
                <span className={`font-sans text-xs tracking-wider font-medium transition-colors duration-200
                  ${isActive ? 'text-brown-900 font-semibold' : 'text-brown-500 group-hover:text-brown-800'}`}
                >
                  {cat}
                </span>
                {/* Underline bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ef4444] transition-all duration-300" />
                )}
              </button>
            )
          })}
        </div>

        {/* Sub-Header / Filters and Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-xs tracking-wider uppercase font-sans text-brown-500 border-b border-cream-200/50 pb-4">
          <div className="normal-case text-sm text-brown-400 font-light">
            Showing {sorted.length > 0 ? `1–${sorted.length}` : '0'} of {products.length} results
          </div>
          
          <div className="flex items-center gap-6">
            {/* Filter Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center gap-1.5 hover:text-brown-800 font-medium transition-colors focus:outline-none"
              >
                Filters
                <svg className={`w-3 h-3 transition-transform ${showSearch ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showSearch && (
                <div className="absolute right-0 mt-2 z-20 bg-white border border-cream-200 rounded-xl shadow-lg p-3 w-60 normal-case">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-3 py-1.5 border border-cream-200 rounded-lg text-xs text-brown-700 focus:outline-none focus:border-brown-400"
                  />
                </div>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="font-light">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-brown-850 border-none outline-none focus:ring-0 cursor-pointer pr-4 uppercase text-xs tracking-wider"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-brown-300 font-sans text-sm tracking-widest animate-pulse">
            Loading Fresh Selections...
          </div>
        )}

        {!loading && sorted.length === 0 && (
          <div className="text-center py-20 text-brown-300 font-sans text-sm tracking-widest">
            No products found.
          </div>
        )}

        {/* Grid showing exactly 4 products per row on all views */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {sorted.map((product, i) => (
            <div
              key={product._id}
              className="group flex flex-col justify-between cursor-pointer"
              style={{ 
                animationDelay: `${i * 50}ms`, 
                animation: 'fadeInUp 0.6s ease-out forwards', 
                opacity: 0 
              }}
            >
              {/* Product Image: raw photo without border or background color */}
              <div className="relative w-full aspect-square overflow-hidden mb-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brown-200 text-3xl">🥐</div>
                )}
                
                {/* Red ADD TO CART overlay button on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-[#ef4444] text-white text-[8px] sm:text-xs font-sans tracking-wider uppercase font-semibold px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full shadow-lg transition-transform hover:bg-[#d93838]">
                    Add
                  </button>
                </div>
              </div>

              {/* Product Info: Name & Price on one row, Subtitle below */}
              <div className="px-0.5">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-sans text-[10px] sm:text-sm font-semibold text-brown-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <span className="font-sans text-[10px] sm:text-sm font-semibold text-[#ef4444] whitespace-nowrap">
                    ₹{product.price}
                  </span>
                </div>
                <p className="font-sans text-[9px] sm:text-[11px] text-brown-400 font-light mt-0.5">
                  {getCategorySubtitle(product.category?.name)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cakes CTA */}
        <div className="text-center mt-16">
          <Link
            to="/cakes"
            className="font-serif text-base text-brown-600 italic hover:text-brown-900 transition-colors hover:tracking-wider duration-300"
          >
            View All Cake Collections →
          </Link>
        </div>
      </div>
    </section>
  )
}
