import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
