import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import CustomCake from '../models/CustomCake.js'

const router = express.Router()

// Storage & WebP Compression Setup
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.memoryStorage()
const upload = multer({ storage })

// Helper: Save uploaded buffer as optimized WebP
const saveWebp = async (buffer) => {
  const filename = `custom-cake-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`
  const filepath = path.join(uploadsDir, filename)
  await sharp(buffer).webp({ quality: 80 }).toFile(filepath)
  return `/uploads/${filename}`
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

// POST create custom cake photo (Auto WebP conversion)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || ''

    if (req.file) {
      imageUrl = await saveWebp(req.file.buffer)
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
router.delete('/:id', async (req, res) => {
  try {
    const customCake = await CustomCake.findById(req.params.id)
    if (!customCake) return res.status(404).json({ error: 'Custom cake not found' })

    if (customCake.imageUrl && customCake.imageUrl.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), customCake.imageUrl)
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath) } catch {}
      }
    }

    await CustomCake.findByIdAndDelete(req.params.id)
    res.json({ message: 'Custom cake deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
