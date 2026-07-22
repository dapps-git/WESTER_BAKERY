import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes & Healthcheck (Supports direct, /api, and cPanel full-path mounting)
const prefixes = ['', '/api', '/WESTERN_BACKERY/api', '/WESTERNBAKERY/api', '/WESTER_BAKERY/api']

prefixes.forEach((prefix) => {
  app.use(`${prefix}/categories`, categoryRoutes)
  app.use(`${prefix}/products`, productRoutes)
  app.get(`${prefix}/health`, (req, res) => res.json({ status: 'ok', message: 'Western Bakery API running ✅' }))
  app.get(`${prefix}`, (req, res) => res.json({ message: 'Western Bakery API running ✅' }))
})



// Start Server immediately (Required for cPanel Phusion Passenger)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

// Connect to MongoDB asynchronously
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://westernbakehouseptb_db_user:WESTERNBAKERY@cluster0.ecrnbjn.mongodb.net/WESTERNBAKERY?appName=Cluster0'

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected — WESTERNBAKERY'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

