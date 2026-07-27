import mongoose from 'mongoose'

const cakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Chocolate' },
    description: { type: String, default: '' },
    prices: [
      {
        weight: { type: String, default: '1 kg' },
        price: { type: Number, required: true },
      },
    ],
    imageUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Cake', cakeSchema)
