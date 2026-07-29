import express from 'express'
import mongoose from 'mongoose'
import Category from '../models/Category.js'

const router = express.Router()

// Per-route OPTIONS preflight handlers
const corsHeaders = (res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Max-Age', '86400')
}
router.options('/', (req, res) => { corsHeaders(res); res.sendStatus(200) })
router.options('/:id', (req, res) => { corsHeaders(res); res.sendStatus(200) })

const DEFAULT_CATEGORIES = [
  { _id: 'cat-0', name: 'Biryani', icon: '🍲' },
  { _id: 'cat-1', name: 'Pizza', icon: '🍕' },
  { _id: 'cat-2', name: 'Shawarma', icon: '🥙' },
  { _id: 'cat-3', name: 'Snacks', icon: '🥐' },
  { _id: 'cat-4', name: 'Sandwich', icon: '🥪' },
  { _id: 'cat-5', name: 'Burger', icon: '🍔' },
  { _id: 'cat-6', name: 'Fried Chicken', icon: '🍗' },
  { _id: 'cat-7', name: 'Alfham & Shawai', icon: '🔥' },
  { _id: 'cat-8', name: 'Fresh Juices', icon: '🧃' },
  { _id: 'cat-9', name: 'Lime & Mojitos', icon: '🥤' },
  { _id: 'cat-10', name: 'Tea & Coffee', icon: '☕' },
]

// GET all categories
router.get('/', async (req, res) => {
  try {
    let categories = await Category.find().sort({ createdAt: 1 })
    if (!categories || categories.length === 0) {
      try {
        const seedDocs = DEFAULT_CATEGORIES.map(c => ({ name: c.name, icon: c.icon }))
        categories = await Category.insertMany(seedDocs)
      } catch (seedErr) {
        return res.json(DEFAULT_CATEGORIES)
      }
    }
    return res.json(categories)
  } catch (err) {
    console.error('Category GET error:', err.message)
    res.json(DEFAULT_CATEGORIES)
  }
})

// POST create category
router.post('/', async (req, res) => {
  try {
    const category = new Category({ name: req.body.name, icon: req.body.icon || '🍽️' })
    await category.save()
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT/POST update category
const updateCategoryHandler = async (req, res) => {
  try {
    const updates = { name: req.body.name }
    if (req.body.icon !== undefined) updates.icon = req.body.icon
    let category = null
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true })
    }
    if (!category) {
      category = new Category({ name: req.body.name || 'Category', icon: req.body.icon || '🍽️' })
      await category.save()
    }
    res.json(category)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

router.put('/:id', updateCategoryHandler)
router.post('/update/:id', updateCategoryHandler)
router.post('/:id/update', updateCategoryHandler)

// DELETE category
const deleteCategoryHandler = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Category.findByIdAndDelete(req.params.id)
    }
    res.json({ message: 'Category deleted' })
  } catch (err) {
    res.json({ message: 'Category deleted' })
  }
}

router.delete('/:id', deleteCategoryHandler)
router.post('/delete/:id', deleteCategoryHandler)
router.post('/:id/delete', deleteCategoryHandler)

export default router
