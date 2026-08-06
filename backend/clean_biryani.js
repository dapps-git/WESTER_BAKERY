import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://westernbakehouseptb_db_user:westernbakery@cluster0.jsfljpe.mongodb.net/WESTERNBAKERY?appName=Cluster0'

async function clean() {
  await mongoose.connect(mongoURI)
  const res = await Product.deleteMany({ name: { $in: ['Half Rice', 'Full Rice'] } })
  console.log('Cleaned up extra Biryani entries:', res)
  process.exit(0)
}

clean()
