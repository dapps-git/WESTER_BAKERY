import express from 'express'
import Category from '../models/Category.js'

const router = express.Router()

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
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
