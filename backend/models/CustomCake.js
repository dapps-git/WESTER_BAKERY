import mongoose from 'mongoose'

const customCakeSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Custom Cake' },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('CustomCake', customCakeSchema)
