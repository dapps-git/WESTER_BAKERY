import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Tag,
  Package,
  Cake as CakeIcon,
  LogOut,
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  Layers,
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CATEGORY_ICONS = [
  '🍽️','🥐','🎂','🧁','🍕','🍔','🌮','🥗','🍜','🍛','🍱','🥩',
  '🥪','🌯','🥙','🥘','🫕','🍲','🥫','🫙','🍞','🥖','🧇','🥞',
  '🍩','🍪','🍫','🍰','🍮','🍭','🍬','🧃','☕','🧋','🥤','🍵',
]

const CAKE_CATEGORIES = [
  'Pieces',
  'Chocolate',
  'Fruit',
  'Premium',
  'Specialty',
  'Red Velvet',
  'Nuts & Caramel',
]

const DEFAULT_FOOD_CATEGORIES = [
  { _id: 'cat-1', name: 'Snacks', icon: '🥐' },
  { _id: 'cat-2', name: 'Sandwich', icon: '🥪' },
  { _id: 'cat-3', name: 'Burger', icon: '🍔' },
  { _id: 'cat-4', name: 'Fried Chicken', icon: '🍗' },
  { _id: 'cat-5', name: 'Shawarma', icon: '🥙' },
  { _id: 'cat-6', name: 'Alfham & Shawai', icon: '🔥' },
  { _id: 'cat-7', name: 'Pizza', icon: '🍕' },
  { _id: 'cat-8', name: 'Fresh Juices', icon: '🧃' },
  { _id: 'cat-9', name: 'Lime & Mojitos', icon: '🥤' },
  { _id: 'cat-10', name: 'Tea & Coffee', icon: '☕' },
]

export default function AdminDashboard() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('western_admin_token') === 'true'
  })
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Tabs: 'products' | 'cakes' | 'categories'
  const [tab, setTab] = useState('products')

  // Cake Subtab: 'normal' | 'custom'
  const [cakeSubTab, setCakeSubTab] = useState('normal')

  // Products & Categories state
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(DEFAULT_FOOD_CATEGORIES)
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', image: null })
  const [editingProduct, setEditingProduct] = useState(null)
  const [productModal, setProductModal] = useState(false)
  const [imgPreview, setImgPreview] = useState(null)
  const fileRef = useRef()

  // Normal Cakes state
  const [cakes, setCakes] = useState([])
  const [cakeForm, setCakeForm] = useState({
    name: '',
    category: 'Chocolate',
    description: '',
    price500g: '',
    price1kg: '',
    image: null,
  })
  const [editingCake, setEditingCake] = useState(null)
  const [cakeModal, setCakeModal] = useState(false)
  const [cakeImgPreview, setCakeImgPreview] = useState(null)
  const cakeFileRef = useRef()

  // Custom Cakes state
  const [customCakes, setCustomCakes] = useState([])
  const [customForm, setCustomForm] = useState({ name: '', image: null })
  const [customModal, setCustomModal] = useState(false)
  const [customImgPreview, setCustomImgPreview] = useState(null)
  const customFileRef = useRef()

  // Category state
  const [catForm, setCatForm] = useState({ name: '', icon: '🍽️' })
  const [editingCat, setEditingCat] = useState(null)
  const [catModal, setCatModal] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  const [msg, setMsg] = useState(null)

  const notify = (text, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3000)
  }

  const loadData = async () => {
    try {
      const [p, c, ck, cc] = await Promise.allSettled([
        axios.get(`${API}/api/products`),
        axios.get(`${API}/api/categories`),
        axios.get(`${API}/api/cakes`),
        axios.get(`${API}/api/custom-cakes`),
      ])

      if (p.status === 'fulfilled') setProducts(p.value.data)
      if (c.status === 'fulfilled' && c.value.data?.length > 0) setCategories(c.value.data)
      if (ck.status === 'fulfilled') setCakes(ck.value.data)
      if (cc.status === 'fulfilled') setCustomCakes(cc.value.data)
    } catch {
      notify('Could not connect to backend', false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  // ─── ADMIN LOGIN ──────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      // Direct credentials check as specified:
      // email: westernadmin@gmail.com, pass: WESTER@ADMIN
      if (loginEmail.trim() === 'westernadmin@gmail.com' && loginPassword === 'WESTER@ADMIN') {
        localStorage.setItem('western_admin_token', 'true')
        setIsAuthenticated(true)
        notify('Welcome back, Admin!')
        setLoginLoading(false)
        return
      }

      // Fallback try API authentication endpoint
      const res = await axios.post(`${API}/api/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      })

      if (res.data?.success) {
        localStorage.setItem('western_admin_token', 'true')
        setIsAuthenticated(true)
        notify('Welcome back, Admin!')
      } else {
        setLoginError('Invalid credentials. Check email & password.')
      }
    } catch (err) {
      if (loginEmail.trim() === 'westernadmin@gmail.com' && loginPassword === 'WESTER@ADMIN') {
        localStorage.setItem('western_admin_token', 'true')
        setIsAuthenticated(true)
        notify('Welcome back, Admin!')
      } else {
        setLoginError('Invalid login credentials. Please try again.')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('western_admin_token')
    setIsAuthenticated(false)
    notify('Logged out successfully.')
  }

  // ─── Product CRUD ───────────────────────────────────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm({ name: '', category: '', price: '', image: null })
    setImgPreview(null)
    setProductModal(true)
  }

  const openEditProduct = (p) => {
    setEditingProduct(p)
    setProductForm({ name: p.name, category: p.category?._id || '', price: p.price, image: null })
    setImgPreview(p.imageUrl || null)
    setProductModal(true)
  }

  const submitProduct = async () => {
    if (!productForm.name.trim()) return notify('Product name is required', false)
    if (!productForm.category) return notify('Please select a category', false)
    if (!productForm.price) return notify('Price is required', false)
    if (!editingProduct && !productForm.image) return notify('Please upload a product image', false)

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('name', productForm.name)
      fd.append('category', productForm.category)
      fd.append('price', productForm.price)
      if (productForm.image) fd.append('image', productForm.image)

      if (editingProduct) {
        await axios.put(`${API}/api/products/${editingProduct._id}`, fd)
        notify('Product updated!')
      } else {
        await axios.post(`${API}/api/products`, fd)
        notify('Product added!')
      }
      setProductModal(false)
      loadData()
    } catch (err) {
      notify(err.response?.data?.error || 'Error saving product', false)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await axios.delete(`${API}/api/products/${id}`)
      notify('Product deleted!')
      loadData()
    } catch {
      notify('Error deleting', false)
    }
  }

  // ─── Cake CRUD (Normal Cakes) ──────────────────────────────────────────────
  const openAddCake = () => {
    setEditingCake(null)
    setCakeForm({
      name: '',
      category: 'Chocolate',
      description: '',
      price500g: '',
      price1kg: '',
      image: null,
    })
    setCakeImgPreview(null)
    setCakeModal(true)
  }

  const openEditCake = (c) => {
    setEditingCake(c)
    const p500 = c.prices?.find(p => p.weight === '500g')?.price || ''
    const p1k = c.prices?.find(p => p.weight === '1 kg')?.price || c.prices?.[0]?.price || ''
    setCakeForm({
      name: c.name,
      category: c.category || 'Chocolate',
      description: c.description || '',
      price500g: p500,
      price1kg: p1k,
      image: null,
    })
    setCakeImgPreview(c.imageUrl || null)
    setCakeModal(true)
  }

  const submitCake = async () => {
    if (!cakeForm.name.trim()) return notify('Cake name is required', false)
    if (!cakeForm.price500g && !cakeForm.price1kg) return notify('Please enter at least one price (500g or 1kg)', false)
    if (!editingCake && !cakeForm.image) return notify('Please upload a cake image', false)

    setSubmitting(true)
    try {
      const prices = []
      if (cakeForm.price500g) prices.push({ weight: '500g', price: Number(cakeForm.price500g) })
      if (cakeForm.price1kg) prices.push({ weight: '1 kg', price: Number(cakeForm.price1kg) })
      if (prices.length === 0) prices.push({ weight: '1 kg', price: 600 })

      const fd = new FormData()
      fd.append('name', cakeForm.name)
      fd.append('category', cakeForm.category)
      fd.append('description', cakeForm.description)
      fd.append('prices', JSON.stringify(prices))
      if (cakeForm.image) fd.append('image', cakeForm.image)

      if (editingCake) {
        await axios.put(`${API}/api/cakes/${editingCake._id}`, fd)
        notify('Cake updated!')
      } else {
        await axios.post(`${API}/api/cakes`, fd)
        notify('Cake added to collection!')
      }
      setCakeModal(false)
      loadData()
    } catch (err) {
      notify(err.response?.data?.error || 'Error saving cake', false)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteCake = async (id) => {
    if (!confirm('Delete this cake from collection?')) return
    try {
      await axios.delete(`${API}/api/cakes/${id}`)
      notify('Cake deleted!')
      loadData()
    } catch {
      notify('Error deleting cake', false)
    }
  }

  // ─── Custom Cake CRUD ──────────────────────────────────────────────────────
  const openAddCustomCake = () => {
    setCustomForm({ name: '', image: null })
    setCustomImgPreview(null)
    setCustomModal(true)
  }

  const submitCustomCake = async () => {
    if (!customForm.image) {
      notify('Please select an image for custom cake', false)
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('name', customForm.name || 'Custom Cake Design')
      fd.append('image', customForm.image)

      await axios.post(`${API}/api/custom-cakes`, fd)
      notify('Custom cake photo added to gallery!')
      setCustomModal(false)
      loadData()
    } catch (err) {
      notify(err.response?.data?.error || 'Error saving custom cake design', false)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteCustomCake = async (id) => {
    if (!confirm('Delete this custom cake photo?')) return
    try {
      await axios.delete(`${API}/api/custom-cakes/${id}`)
      notify('Custom cake photo deleted!')
      loadData()
    } catch {
      notify('Error deleting custom cake', false)
    }
  }

  // ─── Category CRUD ─────────────────────────────────────────────────────────
  const openAddCat = () => {
    setEditingCat(null)
    setCatForm({ name: '', icon: '🍽️' })
    setShowIconPicker(false)
    setCatModal(true)
  }

  const openEditCat = (c) => {
    setEditingCat(c)
    setCatForm({ name: c.name, icon: c.icon || '🍽️' })
    setShowIconPicker(false)
    setCatModal(true)
  }

  const submitCat = async () => {
    try {
      if (editingCat) {
        await axios.put(`${API}/api/categories/${editingCat._id}`, catForm)
        notify('Category updated!')
      } else {
        await axios.post(`${API}/api/categories`, catForm)
        notify('Category added!')
      }
      setCatModal(false)
      loadData()
    } catch {
      notify('Error saving category', false)
    }
  }

  const deleteCat = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await axios.delete(`${API}/api/categories/${id}`)
      notify('Category deleted!')
      loadData()
    } catch {
      notify('Error deleting', false)
    }
  }

  // ─── LOGIN SCREEN VIEW ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 font-sans text-gray-900">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#6a2e16]/10 text-[#6a2e16] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#6a2e16]/20">
              <Lock size={28} />
            </div>
            <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#6a2e16] tracking-wide">
              Western Bakery
            </h1>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mt-1">
              Admin Portal Access
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold text-center">
              {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="westernadmin@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#6a2e16] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#6a2e16] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#6a2e16] hover:bg-[#522310] text-white font-bold text-sm rounded-2xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-5">
            <a href="/" className="text-xs text-gray-400 hover:text-[#6a2e16] font-semibold transition-colors">
              ← Return to Customer Website
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ─── MAIN DASHBOARD VIEW ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-gray-900">
      
      {/* Toast Notification */}
      {msg && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold tracking-wide transition-all ${
            msg.ok ? 'bg-[#6a2e16] text-white' : 'bg-red-600 text-white'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Top bar */}
      <div className="bg-[#3D1D0F] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <p className="font-serif text-xl italic font-bold tracking-wider">WESTERN BAKERY</p>
          <p className="font-sans text-[10px] tracking-[0.3em] text-[#C8A27C] uppercase font-semibold">
            Admin Control Center
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            className="font-sans text-xs text-[#C8A27C] hover:text-white font-semibold transition-colors"
          >
            ← View Website
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
            title="Logout"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="border-b border-gray-200 px-6 flex gap-6 bg-white shadow-2xs">
        {[
          { id: 'products', icon: <Package size={16} />, label: 'Food Products' },
          { id: 'cakes', icon: <CakeIcon size={16} />, label: 'Cake Collections' },
          { id: 'categories', icon: <Tag size={16} />, label: 'Categories' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 py-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all -mb-px ${
              tab === t.id
                ? 'border-[#6a2e16] text-[#6a2e16]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ─── TAB 1: FOOD PRODUCTS ─── */}
        {tab === 'products' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#6a2e16]">
                  Food Products <span className="text-gray-400 text-lg font-sans font-normal">({products.length})</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage burgers, shawarmas, fried chicken & beverages</p>
              </div>
              <button onClick={openAddProduct} className="px-4 py-2.5 bg-[#6a2e16] text-white rounded-2xl font-bold text-xs hover:bg-[#522310] transition-colors flex items-center gap-2 shadow-sm">
                <Plus size={15} /> Add Food Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 overflow-hidden relative">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-900 mb-0.5">{p.name}</h3>
                    <p className="text-[11px] text-gray-500 font-medium mb-2">
                      {p.category?.icon || ''} {p.category?.name || 'Uncategorized'}
                    </p>
                    <p className="font-bold text-sm text-[#6a2e16] mb-3">₹{p.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditProduct(p)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold border border-red-100 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── TAB 2: SEPARATE CAKE ADDING SECTION (NORMAL vs CUSTOM) ─── */}
        {tab === 'cakes' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#6a2e16] flex items-center gap-2">
                  <CakeIcon size={24} /> Cake Management Section
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Separate collections for Standard Menu Cakes vs Customized Cake Gallery
                </p>
              </div>

              {/* Sub-tab Toggle: Normal Cakes vs Custom Cakes */}
              <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 self-start sm:self-auto">
                <button
                  onClick={() => setCakeSubTab('normal')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    cakeSubTab === 'normal'
                      ? 'bg-[#6a2e16] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layers size={14} /> Normal Cakes ({cakes.length})
                </button>
                <button
                  onClick={() => setCakeSubTab('custom')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    cakeSubTab === 'custom'
                      ? 'bg-[#6a2e16] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles size={14} /> Custom Cakes ({customCakes.length})
                </button>
              </div>
            </div>

            {/* SUB-SECTION A: NORMAL CAKES */}
            {cakeSubTab === 'normal' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg font-bold text-[#3D1D0F]">
                    Normal Cakes Collection (Database)
                  </h3>
                  <button
                    onClick={openAddCake}
                    className="px-4 py-2.5 bg-[#6a2e16] text-white rounded-2xl font-bold text-xs hover:bg-[#522310] transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Plus size={15} /> Add Normal Cake
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {cakes.map((c) => {
                    const priceDisp = c.prices?.map(p => `${p.weight}: ₹${p.price}`).join(' | ') || `₹${c.price || 600}`
                    return (
                      <div key={c._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">🎂</div>
                          )}
                          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                            {c.category || 'Chocolate'}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 leading-snug mb-1">{c.name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{c.description}</p>
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[#6a2e16] mb-3">{priceDisp}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditCake(c)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => deleteCake(c._id)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold border border-red-100 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* SUB-SECTION B: CUSTOM CAKES */}
            {cakeSubTab === 'custom' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg font-bold text-[#3D1D0F]">
                    Customized Cake Design Gallery
                  </h3>
                  <button
                    onClick={openAddCustomCake}
                    className="px-4 py-2.5 bg-[#6a2e16] text-white rounded-2xl font-bold text-xs hover:bg-[#522310] transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Plus size={15} /> Add Custom Cake Photo
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {customCakes.map((cc) => (
                    <div key={cc._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative">
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img src={cc.imageUrl} alt={cc.name || 'Custom Cake'} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700 truncate">{cc.name || 'Custom Cake'}</span>
                        <button
                          onClick={() => deleteCustomCake(cc._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── TAB 3: CATEGORIES ─── */}
        {tab === 'categories' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#6a2e16]">
                  Categories <span className="text-gray-400 text-lg font-sans font-normal">({categories.length})</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage main menu food categories & icons</p>
              </div>
              <button onClick={openAddCat} className="px-4 py-2.5 bg-[#6a2e16] text-white rounded-2xl font-bold text-xs hover:bg-[#522310] transition-colors flex items-center gap-2 shadow-sm">
                <Plus size={15} /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6a2e16]/10 flex items-center justify-center text-xl">
                      {c.icon || '🍽️'}
                    </div>
                    <p className="font-bold text-sm text-gray-900">{c.name}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEditCat(c)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteCat(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ─── MODAL 1: FOOD PRODUCT ─── */}
      {productModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl font-bold text-[#6a2e16]">
                {editingProduct ? 'Edit Food Product' : 'Add Food Product'}
              </h3>
              <button onClick={() => setProductModal(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Product Name</label>
                <input
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                  value={productForm.name}
                  onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Pani Puri Shawarma"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16] bg-white"
                  value={productForm.category}
                  onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id?.startsWith('cat-') ? c.name : c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                  value={productForm.price}
                  onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 120"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Product Image</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-[#6a2e16] transition-colors"
                >
                  {imgPreview ? (
                    <img src={imgPreview} className="w-28 h-20 object-cover rounded-xl" alt="preview" />
                  ) : (
                    <Upload size={24} className="text-gray-400" />
                  )}
                  <p className="text-xs text-gray-500">{imgPreview ? 'Click to change image' : 'Upload photo'}</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setProductForm((f) => ({ ...f, image: file }))
                        setImgPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setProductModal(false)} disabled={submitting} className="flex-1 py-2.5 border border-gray-200 rounded-2xl font-bold text-xs text-gray-600">Cancel</button>
              <button onClick={submitProduct} disabled={submitting} className="flex-1 py-2.5 bg-[#6a2e16] text-white rounded-2xl font-bold text-xs hover:bg-[#522310] disabled:opacity-50">
                {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: NORMAL CAKE ─── */}
      {cakeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl font-bold text-[#6a2e16]">
                {editingCake ? 'Edit Cake Item' : 'Add Normal Cake Item'}
              </h3>
              <button onClick={() => setCakeModal(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Cake Name</label>
                <input
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                  value={cakeForm.name}
                  onChange={(e) => setCakeForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Black Forest Cake"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Cake Category</label>
                <select
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16] bg-white"
                  value={cakeForm.category}
                  onChange={(e) => setCakeForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CAKE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                  value={cakeForm.description}
                  onChange={(e) => setCakeForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Moist sponge layered with cream & cherries..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Price (500g)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                    value={cakeForm.price500g}
                    onChange={(e) => setCakeForm((f) => ({ ...f, price500g: e.target.value }))}
                    placeholder="e.g. 350"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Price (1 kg)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                    value={cakeForm.price1kg}
                    onChange={(e) => setCakeForm((f) => ({ ...f, price1kg: e.target.value }))}
                    placeholder="e.g. 650"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Cake Image</label>
                <div
                  onClick={() => cakeFileRef.current.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-[#6a2e16] transition-colors"
                >
                  {cakeImgPreview ? (
                    <img src={cakeImgPreview} className="w-28 h-20 object-cover rounded-xl" alt="preview" />
                  ) : (
                    <Upload size={24} className="text-gray-400" />
                  )}
                  <p className="text-xs text-gray-500">{cakeImgPreview ? 'Click to change image' : 'Upload cake photo'}</p>
                  <input
                    ref={cakeFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setCakeForm((f) => ({ ...f, image: file }))
                        setCakeImgPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setCakeModal(false)} disabled={submitting} className="flex-1 py-2.5 border border-gray-200 rounded-2xl font-bold text-xs text-gray-600">Cancel</button>
              <button onClick={submitCake} disabled={submitting} className="flex-1 py-2.5 bg-[#6a2e16] text-white rounded-2xl font-bold text-xs hover:bg-[#522310] disabled:opacity-50">
                {submitting ? 'Saving...' : (editingCake ? 'Update Cake' : 'Save Cake')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: CUSTOM CAKE ─── */}
      {customModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl font-bold text-[#6a2e16]">Add Custom Cake Photo</h3>
              <button onClick={() => setCustomModal(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Label / Title (Optional)</label>
                <input
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                  value={customForm.name}
                  onChange={(e) => setCustomForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. 2-Tier Wedding Cake"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Design Image</label>
                <div
                  onClick={() => customFileRef.current.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-[#6a2e16] transition-colors"
                >
                  {customImgPreview ? (
                    <img src={customImgPreview} className="w-28 h-28 object-cover rounded-xl" alt="preview" />
                  ) : (
                    <Upload size={28} className="text-gray-400" />
                  )}
                  <p className="text-xs text-gray-500">{customImgPreview ? 'Click to change photo' : 'Upload custom design photo'}</p>
                  <input
                    ref={customFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setCustomForm((f) => ({ ...f, image: file }))
                        setCustomImgPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setCustomModal(false)} disabled={submitting} className="flex-1 py-2.5 border border-gray-200 rounded-2xl font-bold text-xs text-gray-600">Cancel</button>
              <button onClick={submitCustomCake} disabled={submitting} className="flex-1 py-2.5 bg-[#6a2e16] text-white rounded-2xl font-bold text-xs hover:bg-[#522310] disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Custom Design'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: CATEGORY ─── */}
      {catModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl font-bold text-[#6a2e16]">
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setCatModal(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Category Name</label>
                <input
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#6a2e16]"
                  value={catForm.name}
                  onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Pizza"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Category Icon</label>
                <button
                  type="button"
                  onClick={() => setShowIconPicker((v) => !v)}
                  className="flex items-center gap-3 w-full border border-gray-200 rounded-2xl px-4 py-2.5 hover:border-[#6a2e16] transition-colors"
                >
                  <span className="text-2xl">{catForm.icon}</span>
                  <span className="text-sm text-gray-600">{showIconPicker ? 'Close picker' : 'Choose icon'}</span>
                </button>

                {showIconPicker && (
                  <div className="mt-2 p-3 border border-gray-200 rounded-2xl bg-gray-50 grid grid-cols-8 gap-1.5">
                    {CATEGORY_ICONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setCatForm((f) => ({ ...f, icon: emoji }))
                          setShowIconPicker(false)
                        }}
                        className={`text-xl p-1.5 rounded-xl hover:bg-gray-200 transition-colors ${
                          catForm.icon === emoji ? 'bg-gray-300' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setCatModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-2xl font-bold text-xs text-gray-600">Cancel</button>
              <button onClick={submitCat} className="flex-1 py-2.5 bg-[#6a2e16] text-white rounded-2xl font-bold text-xs hover:bg-[#522310]">
                {editingCat ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
