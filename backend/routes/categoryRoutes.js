import express from 'express'
import Category from '../models/Category.js'

const router = express.Router()

const DEFAULT_CATEGORIES = [
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

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const updates = { name: req.body.name }
    if (req.body.icon !== undefined) updates.icon = req.body.icon
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true })
    res.json(category)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Category deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
