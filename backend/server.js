import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cakeRoutes from './routes/cakeRoutes.js'
import customCakeRoutes from './routes/customCakeRoutes.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()

// Explicit Global CORS Middleware to resolve origin blocks from www.westernbakery.in / westernbakery.in
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Max-Age', '86400')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Handle OPTIONS preflight for ALL paths explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Max-Age', '86400')
  res.sendStatus(200)
})

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}))
app.use(express.json())

// Serve uploads folder statically for local images
const uploadsPath = path.join(process.cwd(), 'uploads')
app.use('/uploads', express.static(uploadsPath))

// Routes & Healthcheck (Supports all direct and cPanel full-path prefixes)
const prefixes = [
  '',
  '/api',
  '/westernbakery',
  '/westernbakery/api',
  '/WESTERNBAKERY',
  '/WESTERNBAKERY/api',
  '/western_backery',
  '/western_backery/api',
  '/WESTERN_BACKERY',
  '/WESTERN_BACKERY/api',
  '/wester_bakery',
  '/wester_bakery/api',
  '/WESTER_BAKERY',
  '/WESTER_BAKERY/api',
]

prefixes.forEach((prefix) => {
  app.use(`${prefix}/categories`, categoryRoutes)
  app.use(`${prefix}/products`, productRoutes)
  app.use(`${prefix}/cakes`, cakeRoutes)
  app.use(`${prefix}/custom-cakes`, customCakeRoutes)
  app.use(`${prefix}/auth`, authRoutes)
  app.use(`${prefix}/uploads`, express.static(uploadsPath))
  app.get(`${prefix}/health`, (req, res) => res.json({ status: 'ok', message: 'Western Bakery API running ✅' }))
  app.get(`${prefix}`, (req, res) => res.json({ message: 'Western Bakery API running ✅' }))
})

// Start Server immediately (Required for cPanel Phusion Passenger)
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is currently in use. Retrying or waiting for free port...`)
  } else {
    console.error('❌ Server error:', err)
  }
})

// Connect to MongoDB asynchronously
const defaultMongoURI = 'mongodb+srv://dappstech2025_db_user:dapps1234@cluster0.ecrnbjn.mongodb.net/WESTERNBAKERY?appName=Cluster0'
let mongoURI = process.env.MONGO_URI || defaultMongoURI

if (mongoURI.includes('westernbakehouseptb_db_user')) {
  mongoURI = defaultMongoURI
}

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('✅ MongoDB connected — WESTERNBAKERY'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))
