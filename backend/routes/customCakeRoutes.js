import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import CustomCake from '../models/CustomCake.js'

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'fpmj7xap',
  api_key: process.env.CLOUDINARY_API_KEY || '228953851898214',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'iNY-ONPPCrF_dUlWox528onU8sQ',
})

const upload = multer({ storage: multer.memoryStorage() })

// Helper: Compress to WebP then upload to Cloudinary
const uploadToCloudinary = (buffer, folder = 'westernbakery/custom-cakes') => {
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

// GET all custom cakes
router.get('/', async (req, res) => {
  try {
    const customCakes = await CustomCake.find().sort({ createdAt: -1 })
    res.json(customCakes)
  } catch (err) {
    console.error('CustomCakes GET error:', err.message)
    res.json([])
  }
})

// POST create custom cake photo
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || ''

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'westernbakery/custom-cakes')
    }

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required for custom cake design' })
    }

    const customCake = new CustomCake({
      name: req.body.name || 'Custom Cake Design',
      imageUrl,
    })

    await customCake.save()
    res.status(201).json(customCake)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE custom cake photo
const deleteCustomCakeHandler = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await CustomCake.findByIdAndDelete(req.params.id)
    }
    res.json({ message: 'Custom cake deleted' })
  } catch (err) {
    res.json({ message: 'Custom cake deleted' })
  }
}

router.delete('/:id', deleteCustomCakeHandler)
router.post('/delete/:id', deleteCustomCakeHandler)
router.post('/:id/delete', deleteCustomCakeHandler)

export default router
