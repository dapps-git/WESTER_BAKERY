import express from 'express'
import multer from 'multer'
import { Readable } from 'stream'
import cloudinary from '../config/cloudinary.js'
import Product from '../models/Product.js'

const router = express.Router()

// Multer — memory storage (buffer -> Cloudinary stream)
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Helper: upload buffer to Cloudinary with WebP auto compression
const uploadToCloudinary = (buffer, folder = 'westernbakery') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, format: 'webp', quality: 'auto' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    Readable.from(buffer).pipe(stream)
  })
}

// GET all products (optional ?category=name filter)
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) {
      const { default: Category } = await import('../models/Category.js')
      const cat = await Category.findOne({ name: req.query.category })
      if (cat) {
        filter.category = cat._id
      } else {
        const { default: mongoose } = await import('mongoose')
        filter.category = new mongoose.Types.ObjectId() // guarantees no products match
      }
    }
    const products = await Product.find(filter).populate('category').sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create product (with optional image)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = ''
    let cloudinaryPublicId = ''

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer)
      imageUrl = result.secure_url
      cloudinaryPublicId = result.public_id
    }

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      imageUrl,
      cloudinaryPublicId,
    })

    await product.save()
    const populated = await product.populate('category')
    res.status(201).json(populated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    // If new image uploaded, delete old from Cloudinary and upload new
    if (req.file) {
      if (product.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(product.cloudinaryPublicId)
      }
      const result = await uploadToCloudinary(req.file.buffer)
      product.imageUrl = result.secure_url
      product.cloudinaryPublicId = result.public_id
    }

    product.name = req.body.name || product.name
    product.category = req.body.category || product.category
    product.price = req.body.price || product.price

    await product.save()
    const populated = await product.populate('category')
    res.json(populated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE product (also remove from Cloudinary)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    if (product.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(product.cloudinaryPublicId)
    }

    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
