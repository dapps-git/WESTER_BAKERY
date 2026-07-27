import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import Product from '../models/Product.js'

const router = express.Router()

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Multer memory storage (buffer before Cloudinary upload)
const upload = multer({ storage: multer.memoryStorage() })

// Helper: Compress to WebP then upload to Cloudinary
const uploadToCloudinary = (buffer, folder = 'westernbakery/products') => {
  return new Promise(async (resolve, reject) => {
    try {
      // Convert to WebP at 80% quality using sharp
      const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer()

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', format: 'webp' },
        (error, result) => {
          if (error) return reject(error)
          resolve(result.secure_url)
        }
      )

      // Pipe the WebP buffer into the upload stream
      const readable = new Readable()
      readable.push(webpBuffer)
      readable.push(null)
      readable.pipe(uploadStream)
    } catch (err) {
      reject(err)
    }
  })
}

// Helper: Delete image from Cloudinary by URL
const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return
  try {
    // Extract public_id from URL
    const parts = imageUrl.split('/')
    const fileWithExt = parts[parts.length - 1]
    const file = fileWithExt.split('.')[0]
    const folder = parts[parts.length - 2]
    const publicId = `${folder}/${file}`
    await cloudinary.uploader.destroy(publicId)
  } catch {}
}

// GET all products
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
        filter.category = new mongoose.Types.ObjectId()
      }
    }
    const products = await Product.find(filter).populate('category').sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    console.error('Products GET error:', err.message)
    res.json([])
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

// POST create product → WebP → Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || ''

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'westernbakery/products')
    }

    const { default: Category } = await import('../models/Category.js')
    const { default: mongoose } = await import('mongoose')

    let categoryId = req.body.category
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      let cat = await Category.findOne({ name: categoryId })
      if (!cat) {
        cat = await Category.create({ name: categoryId, icon: '🍽️' })
      }
      categoryId = cat._id
    }

    const product = new Product({
      name: req.body.name,
      category: categoryId,
      price: req.body.price,
      imageUrl,
    })

    await product.save()
    const populated = await product.populate('category')
    res.status(201).json(populated)
  } catch (err) {
    console.error('Product POST error:', err)
    res.status(400).json({ error: err.message })
  }
})

// PUT update product → WebP → Cloudinary
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    if (req.file) {
      await deleteFromCloudinary(product.imageUrl)
      product.imageUrl = await uploadToCloudinary(req.file.buffer, 'westernbakery/products')
    } else if (req.body.imageUrl) {
      product.imageUrl = req.body.imageUrl
    }

    if (req.body.name) product.name = req.body.name
    if (req.body.category) {
      const { default: Category } = await import('../models/Category.js')
      const { default: mongoose } = await import('mongoose')
      let categoryId = req.body.category
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        let cat = await Category.findOne({ name: categoryId })
        if (!cat) cat = await Category.create({ name: categoryId, icon: '🍽️' })
        categoryId = cat._id
      }
      product.category = categoryId
    }
    if (req.body.price) product.price = req.body.price

    await product.save()
    const populated = await product.populate('category')
    res.json(populated)
  } catch (err) {
    console.error('Product PUT error:', err)
    res.status(400).json({ error: err.message })
  }
})

// DELETE product + Cloudinary image
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    await deleteFromCloudinary(product.imageUrl)
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
