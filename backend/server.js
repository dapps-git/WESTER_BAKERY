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

// Healthcheck & root endpoints
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Western Bakery API running ✅' }))
app.get('/', (req, res) => res.json({ message: 'Western Bakery API running ✅' }))

// Routes
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)

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

