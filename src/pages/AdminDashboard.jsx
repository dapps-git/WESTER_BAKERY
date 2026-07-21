import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash2, X, Upload, Tag, Package } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')

  // Products state
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', image: null })
  const [editingProduct, setEditingProduct] = useState(null)
  const [productModal, setProductModal] = useState(false)
  const [imgPreview, setImgPreview] = useState(null)
  const fileRef = useRef()

  // Category state
  const [catForm, setCatForm] = useState({ name: '' })
  const [editingCat, setEditingCat] = useState(null)
  const [catModal, setCatModal] = useState(false)

  const [msg, setMsg] = useState(null)

  const notify = (text, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3000)
  }

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([
        axios.get(`${API}/api/products`),
        axios.get(`${API}/api/categories`),
      ])
      setProducts(p.data)
      setCategories(c.data)
    } catch { notify('Could not connect to backend', false) }
  }

  useEffect(() => { loadData() }, [])

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
    } catch { notify('Error saving product', false) }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await axios.delete(`${API}/api/products/${id}`)
      notify('Product deleted!')
      loadData()
    } catch { notify('Error deleting', false) }
  }

  // ─── Category CRUD ─────────────────────────────────────────────────────────
  const openAddCat = () => { setEditingCat(null); setCatForm({ name: '' }); setCatModal(true) }
  const openEditCat = (c) => { setEditingCat(c); setCatForm({ name: c.name }); setCatModal(true) }

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
    } catch { notify('Error saving category', false) }
  }

  const deleteCat = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await axios.delete(`${API}/api/categories/${id}`)
      notify('Category deleted!')
      loadData()
    } catch { notify('Error deleting', false) }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Toast */}
      {msg && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-sans font-light tracking-wide transition-all
          ${msg.ok ? 'bg-brown-700 text-cream-50' : 'bg-red-600 text-white'}`}>
          {msg.text}
        </div>
      )}

      {/* Top bar */}
      <div className="bg-brown-900 text-cream-50 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-serif text-xl tracking-[0.2em]">WESTERN BAKERY</p>
          <p className="font-sans text-[10px] tracking-[0.4em] text-brown-300 uppercase">Admin Dashboard</p>
        </div>
        <a href="/" className="font-sans text-xs text-brown-300 hover:text-cream-50 tracking-widest transition-colors">
          ← View Site
        </a>
      </div>

      {/* Tabs */}
      <div className="border-b border-cream-200 px-6 flex gap-6 bg-white">
        {[
          { id: 'products', icon: <Package size={15} />, label: 'Products' },
          { id: 'categories', icon: <Tag size={15} />, label: 'Categories' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 py-4 text-xs font-sans tracking-[0.2em] uppercase border-b-2 transition-all -mb-px
              ${tab === t.id ? 'border-brown-700 text-brown-800' : 'border-transparent text-brown-400 hover:text-brown-700'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ─── PRODUCTS TAB ─── */}
        {tab === 'products' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-brown-800">Products <span className="text-brown-300 text-lg">({products.length})</span></h2>
              <button onClick={openAddProduct} className="btn-primary flex items-center gap-2 text-xs">
                <Plus size={14} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map(p => (
                <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden card-hover">
                  <div className="aspect-video bg-cream-100 overflow-hidden">
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl">🍞</div>
                    }
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-sm text-brown-800 font-normal mb-0.5">{p.name}</h3>
                    <p className="font-sans text-[10px] text-brown-400 font-extralight mb-1">{p.category?.name || '—'}</p>
                    <p className="font-serif text-sm text-brown-600 font-medium mb-3">₹{p.price}</p>
                    <div className="flex gap-2">
                      <button onClick={() => openEditProduct(p)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-sans tracking-widest uppercase border border-brown-300 rounded-lg text-brown-500 hover:bg-brown-50 transition-colors">
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => deleteProduct(p._id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-sans tracking-widest uppercase border border-red-200 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── CATEGORIES TAB ─── */}
        {tab === 'categories' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-brown-800">Categories <span className="text-brown-300 text-lg">({categories.length})</span></h2>
              <button onClick={openAddCat} className="btn-primary flex items-center gap-2 text-xs">
                <Plus size={14} /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(c => (
                <div key={c._id} className="bg-white rounded-xl p-5 border border-cream-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brown-100 flex items-center justify-center">
                      <Tag size={14} className="text-brown-500" />
                    </div>
                    <p className="font-serif text-sm text-brown-800">{c.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditCat(c)} className="p-2 rounded-lg text-brown-400 hover:bg-brown-50 hover:text-brown-700 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteCat(c._id)} className="p-2 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ─── Product Modal ─── */}
      {productModal && (
        <div className="fixed inset-0 bg-brown-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl text-brown-800">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setProductModal(false)} className="text-brown-400 hover:text-brown-700"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-brown-400 mb-1.5">Product Name</label>
                <input className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-brown-700 focus:outline-none focus:border-brown-400 transition-colors"
                  value={productForm.name}
                  onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Butter Croissant"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-brown-400 mb-1.5">Category</label>
                <select className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-brown-700 focus:outline-none focus:border-brown-400 transition-colors bg-white"
                  value={productForm.category}
                  onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-brown-400 mb-1.5">Price (₹)</label>
                <input className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-brown-700 focus:outline-none focus:border-brown-400 transition-colors"
                  type="number"
                  value={productForm.price}
                  onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="e.g., 150"
                />
              </div>

              <div>
                <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-brown-400 mb-1.5">Product Image</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="w-full border-2 border-dashed border-cream-300 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-brown-400 transition-colors"
                >
                  {imgPreview
                    ? <img src={imgPreview} className="w-24 h-24 object-cover rounded-lg" />
                    : <Upload size={24} className="text-brown-300" />
                  }
                  <p className="font-sans text-xs text-brown-400 font-extralight">
                    {imgPreview ? 'Click to change image' : 'Click to upload image'}
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files[0]
                      if (file) {
                        setProductForm(f => ({ ...f, image: file }))
                        setImgPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setProductModal(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={submitProduct} className="btn-primary flex-1">
                {editingProduct ? 'Update' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Category Modal ─── */}
      {catModal && (
        <div className="fixed inset-0 bg-brown-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl text-brown-800">{editingCat ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setCatModal(false)} className="text-brown-400 hover:text-brown-700"><X size={18} /></button>
            </div>

            <div>
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-brown-400 mb-1.5">Category Name</label>
              <input
                className="w-full border border-cream-200 rounded-xl px-4 py-2.5 font-sans text-sm text-brown-700 focus:outline-none focus:border-brown-400 transition-colors"
                value={catForm.name}
                onChange={e => setCatForm({ name: e.target.value })}
                placeholder="e.g., Cakes"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setCatModal(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={submitCat} className="btn-primary flex-1">
                {editingCat ? 'Update' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
