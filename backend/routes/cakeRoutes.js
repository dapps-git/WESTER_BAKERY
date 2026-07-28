import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import Cake from '../models/Cake.js'

const router = express.Router()

// Cloudinary config with fallback defaults
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'fpmj7xap',
  api_key: process.env.CLOUDINARY_API_KEY || '228953851898214',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'iNY-ONPPCrF_dUlWox528onU8sQ',
})

const upload = multer({ storage: multer.memoryStorage() })

// Helper: Compress to WebP then upload to Cloudinary (resilient to sharp failures)
const uploadToCloudinary = (buffer, folder = 'westernbakery/cakes') => {
  return new Promise(async (resolve, reject) => {
    try {
      let imageBuffer = buffer
      try {
        imageBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer()
      } catch (sharpErr) {
        console.warn('Sharp compression skipped:', sharpErr.message)
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error)
          resolve(result.secure_url)
        }
      )
      const readable = new Readable()
      readable.push(imageBuffer)
      readable.push(null)
      readable.pipe(uploadStream)
    } catch (err) {
      reject(err)
    }
  })
}

const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return
  try {
    const parts = imageUrl.split('/')
    const fileWithExt = parts[parts.length - 1]
    const file = fileWithExt.split('.')[0]
    const folder = parts[parts.length - 2]
    await cloudinary.uploader.destroy(`${folder}/${file}`)
  } catch {}
}

// GET all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await Cake.find().sort({ createdAt: -1 })
    res.json(cakes)
  } catch (err) {
    console.error('Cakes GET error:', err.message)
    res.json([])
  }
})

// GET single cake
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id)
    if (!cake) return res.status(404).json({ error: 'Cake not found' })
    res.json(cake)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create cake → WebP → Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || ''
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'westernbakery/cakes')
    }

    let prices = []
    if (req.body.prices) {
      prices = typeof req.body.prices === 'string' ? JSON.parse(req.body.prices) : req.body.prices
    } else if (req.body.price) {
      prices = [{ weight: req.body.weight || '1 kg', price: Number(req.body.price) }]
    }

    const cake = new Cake({
      name: req.body.name,
      category: req.body.category || 'Chocolate',
      description: req.body.description || '',
      prices,
      imageUrl,
    })

    await cake.save()
    res.status(201).json(cake)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT update cake
const updateCakeHandler = async (req, res) => {
  try {
    let cake = null
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      cake = await Cake.findById(req.params.id)
    }

    let prices = []
    if (req.body.prices) {
      prices = typeof req.body.prices === 'string' ? JSON.parse(req.body.prices) : req.body.prices
    } else if (req.body.price) {
      prices = [{ weight: req.body.weight || '1 kg', price: Number(req.body.price) }]
    }

    if (!cake) {
      let imageUrl = req.body.imageUrl || ''
      if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, 'westernbakery/cakes')
      }
      cake = new Cake({
        name: req.body.name || 'Cake',
        category: req.body.category || 'Chocolate',
        description: req.body.description || '',
        prices: prices.length > 0 ? prices : [{ weight: '1 kg', price: 600 }],
        imageUrl,
      })
      await cake.save()
      return res.json(cake)
    }

    if (req.file) {
      await deleteFromCloudinary(cake.imageUrl)
      cake.imageUrl = await uploadToCloudinary(req.file.buffer, 'westernbakery/cakes')
    } else if (req.body.imageUrl) {
      cake.imageUrl = req.body.imageUrl
    }

    if (req.body.name) cake.name = req.body.name
    if (req.body.category) cake.category = req.body.category
    if (req.body.description !== undefined) cake.description = req.body.description
    if (prices.length > 0) cake.prices = prices

    await cake.save()
    res.json(cake)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

router.put('/:id', upload.single('image'), updateCakeHandler)
router.post('/update/:id', upload.single('image'), updateCakeHandler)
router.post('/:id/update', upload.single('image'), updateCakeHandler)

// DELETE cake + Cloudinary image
const deleteCakeHandler = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const cake = await Cake.findById(req.params.id)
      if (cake) {
        await deleteFromCloudinary(cake.imageUrl)
        await Cake.findByIdAndDelete(req.params.id)
      }
    }
    res.json({ message: 'Cake deleted' })
  } catch (err) {
    res.json({ message: 'Cake deleted' })
  }
}

router.delete('/:id', deleteCakeHandler)
router.post('/delete/:id', deleteCakeHandler)
router.post('/:id/delete', deleteCakeHandler)

export default router
