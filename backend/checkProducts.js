import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Category from './models/Category.js'
import Product from './models/Product.js'

dotenv.config()

const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://westernbakehouseptb_db_user:westernbakery@cluster0.jsfljpe.mongodb.net/WESTERNBAKERY?appName=Cluster0'

mongoose.connect(mongoURI).then(async () => {
  const all = await Product.find({}).populate('category', 'name').lean()
  const byCategory = {}
  for (const p of all) {
    const cat = p.category?.name || 'Uncategorized'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(p.name)
  }
  for (const [cat, names] of Object.entries(byCategory)) {
    console.log(`\n📦 ${cat} (${names.length} items):`)
    names.forEach(n => console.log(`   - ${n}`))
  }
  process.exit(0)
})
