import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Category from './models/Category.js'
import Product from './models/Product.js'

dotenv.config()

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://westernbakehouseptb_db_user:WESTERNBAKERY@cluster0.ecrnbjn.mongodb.net/WESTERNBAKERY?appName=Cluster0'

const SEED_CATEGORIES = [
  { name: 'Snacks', icon: '🥐' },
  { name: 'Sandwich', icon: '🥪' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Fried Chicken', icon: '🍗' },
  { name: 'Shawarma', icon: '🥙' },
  { name: 'Alfham & Shawai', icon: '🔥' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Fresh Juices', icon: '🧃' },
  { name: 'Lime & Mojitos', icon: '🥤' },
  { name: 'Tea & Coffee', icon: '☕' },
]

const SEED_PRODUCTS = [
  // Shawarma & Alfham
  { name: 'Pani Puri Shawarma', categoryName: 'Shawarma', price: 120, imageUrl: '/food/panipurishawarma.png' },
  { name: 'Honey Chilli Alfham (Quarter)', categoryName: 'Alfham & Shawai', price: 130, imageUrl: '/food/honeychillialfham.jpg' },
  { name: 'Honey Chilli Alfham (Half)', categoryName: 'Alfham & Shawai', price: 250, imageUrl: '/food/honeychillialfham.jpg' },
  { name: 'Honey Chilli Alfham (Full)', categoryName: 'Alfham & Shawai', price: 570, imageUrl: '/food/honeychillialfham.jpg' },
  { name: 'Peri Peri Alfham (Quarter)', categoryName: 'Alfham & Shawai', price: 130, imageUrl: '/food/periperialfham.webp' },
  { name: 'Peri Peri Alfham (Half)', categoryName: 'Alfham & Shawai', price: 250, imageUrl: '/food/periperialfham.webp' },
  { name: 'Peri Peri Alfham (Full)', categoryName: 'Alfham & Shawai', price: 500, imageUrl: '/food/periperialfham.webp' },
  { name: 'Normal Alfham (Quarter)', categoryName: 'Alfham & Shawai', price: 125, imageUrl: '/food/normalaflham.jpg' },
  { name: 'Normal Alfham (Half)', categoryName: 'Alfham & Shawai', price: 240, imageUrl: '/food/normalaflham.jpg' },
  { name: 'Normal Alfham (Full)', categoryName: 'Alfham & Shawai', price: 480, imageUrl: '/food/normalaflham.jpg' },
  { name: 'Normal Shawai (Quarter)', categoryName: 'Alfham & Shawai', price: 125, imageUrl: '/food/normalshawai.jpg' },
  { name: 'Normal Shawai (Half)', categoryName: 'Alfham & Shawai', price: 240, imageUrl: '/food/normalshawai.jpg' },
  { name: 'Normal Shawai (Full)', categoryName: 'Alfham & Shawai', price: 480, imageUrl: '/food/normalshawai.jpg' },

  // Lime & Mojitos
  { name: 'Mint Lime', categoryName: 'Lime & Mojitos', price: 30, imageUrl: '/drinks/mintlime.jpeg' },
  { name: 'Green Apple Lime', categoryName: 'Lime & Mojitos', price: 50, imageUrl: '/drinks/greenapple.webp' },
  { name: 'Fresh Lime', categoryName: 'Lime & Mojitos', price: 20, imageUrl: '/drinks/freshlime.jpg' },
  { name: 'Grape Lime', categoryName: 'Lime & Mojitos', price: 30, imageUrl: '/drinks/grapelime.jpg' },
  { name: 'Blue Lime Cooler', categoryName: 'Lime & Mojitos', price: 40, imageUrl: '/drinks/bluelime.jpg' },
  { name: 'Pineapple Lime', categoryName: 'Lime & Mojitos', price: 30, imageUrl: '/drinks/pineapplelime.webp' },

  // Fresh Juices
  { name: 'Apple Juice', categoryName: 'Fresh Juices', price: 80, imageUrl: '/drinks/applejuice.webp' },
  { name: 'Anar Juice', categoryName: 'Fresh Juices', price: 80, imageUrl: '/drinks/anarjuice.jpg' },
  { name: 'Avocado Shake', categoryName: 'Fresh Juices', price: 80, imageUrl: '/drinks/avacadojuice.webp' },
  { name: 'Mosambi Juice', categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/mosambijuice.jpg' },
  { name: 'Orange Juice', categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/orangejuice.webp' },
  { name: 'Pineapple Juice', categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/pineapplejuice.jpeg' },
  { name: 'Chikku Juice', categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/chikkujuice.avif' },
  { name: 'Mango Juice', categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/mangojuice.webp' },
  { name: 'Papaya Juice', categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/pappayajuice.jpg' },
  { name: 'Grape Juice', categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/grapejuice.webp' },
  { name: 'Shamam Juice', categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/shamamjuice.jpg' },
  { name: 'Watermelon Juice', categoryName: 'Fresh Juices', price: 50, imageUrl: '/drinks/watermelonjuice.jpg' },
  { name: 'Tender Coconut Juice', categoryName: 'Fresh Juices', price: 80, imageUrl: '/drinks/tendercoconutjuice.jpg' },

  // Tea & Coffee
  { name: 'Black Tea', categoryName: 'Tea & Coffee', price: 10, imageUrl: '/drinks/blacktea.jpg' },
  { name: 'Tea', categoryName: 'Tea & Coffee', price: 15, imageUrl: '/drinks/tea.png' },
  { name: 'Lemon Tea', categoryName: 'Tea & Coffee', price: 15, imageUrl: '/drinks/lemontea.jpg' },
]

async function seed() {
  try {
    await mongoose.connect(mongoURI)
    console.log('✅ Connected to MongoDB for seeding')

    const categoryMap = {}
    for (const catData of SEED_CATEGORIES) {
      let cat = await Category.findOne({ name: catData.name })
      if (!cat) {
        cat = await Category.create(catData)
        console.log(`+ Category created: ${cat.name}`)
      }
      categoryMap[catData.name] = cat._id
    }

    for (const prodData of SEED_PRODUCTS) {
      const catId = categoryMap[prodData.categoryName]
      if (!catId) continue

      let prod = await Product.findOne({ name: prodData.name })
      if (!prod) {
        prod = await Product.create({
          name: prodData.name,
          category: catId,
          price: prodData.price,
          imageUrl: prodData.imageUrl,
        })
        console.log(`+ Product created: ${prod.name} (₹${prod.price})`)
      }
    }

    console.log('🎉 Seeding completed successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err)
    process.exit(1)
  }
}

seed()
