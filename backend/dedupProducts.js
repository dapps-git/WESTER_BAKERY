import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://westernbakehouseptb_db_user:westernbakery@cluster0.jsfljpe.mongodb.net/WESTERNBAKERY?appName=Cluster0'

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log('✅ Connected to MongoDB')

    const all = await Product.find({})
    console.log(`📦 Total products in DB: ${all.length}`)

    // Group by lowercase name
    const groups = {}
    for (const p of all) {
      const key = p.name.trim().toLowerCase()
      if (!groups[key]) groups[key] = []
      groups[key].push(p)
    }

    let deleted = 0
    for (const [name, docs] of Object.entries(groups)) {
      if (docs.length > 1) {
        // Sort: prefer the one created FIRST (smallest _id = oldest)
        docs.sort((a, b) => a._id.toString().localeCompare(b._id.toString()))
        const keep = docs[0]
        const remove = docs.slice(1)
        console.log(`🔁 "${name}" has ${docs.length} copies → keeping oldest, deleting ${remove.length}`)
        for (const r of remove) {
          await Product.deleteOne({ _id: r._id })
          deleted++
        }
      }
    }

    console.log(`\n✅ Done! Removed ${deleted} duplicate product(s).`)
    const remaining = await Product.countDocuments()
    console.log(`📦 Products remaining: ${remaining}`)
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
