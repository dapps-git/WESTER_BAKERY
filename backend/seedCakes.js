import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Cake from './models/Cake.js'
import CustomCake from './models/CustomCake.js'

dotenv.config()

const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://westernbakehouseptb_db_user:westernbakery@cluster0.jsfljpe.mongodb.net/WESTERNBAKERY?appName=Cluster0'

// ── All static cakes from Cakes.jsx DEMO_MENU_CAKES ──────────────────────────
const SEED_CAKES = [
  // Pastry Slices (Pieces)
  {
    name: 'Choco Truffle Cake (Piece)',
    category: 'Pieces',
    imageUrl: '/cakes/chco.png',
    description: 'Single slice of rich, dark chocolate truffle cake layered with velvety cocoa ganache.',
    prices: [{ weight: '1 Piece', price: 90 }],
  },
  {
    name: 'Red Velvet Pastry (Piece)',
    category: 'Pieces',
    imageUrl: '/cakes/blckpc.png',
    description: 'Single slice of velvet crimson red sponge layered with smooth cream cheese frosting.',
    prices: [{ weight: '1 Piece', price: 70 }],
  },
  {
    name: 'Black Forest Pastry (Piece)',
    category: 'Pieces',
    imageUrl: '/cakes/red.jpg',
    description: 'Single slice of classic chocolate sponge layered with cherries and whipped cream.',
    prices: [{ weight: '1 Piece', price: 50 }],
  },
  {
    name: 'Caramel Pastry (Piece)',
    category: 'Pieces',
    imageUrl: '/cakes/carml.png',
    description: 'Single slice of butterscotch caramel cake topped with golden caramel drizzle.',
    prices: [{ weight: '1 Piece', price: 80 }],
  },
  {
    name: 'Blue Berry Pastry (Piece)',
    category: 'Pieces',
    imageUrl: '/cakes/lbue.png',
    description: 'Single slice of soft vanilla sponge layered with real blueberry compote.',
    prices: [{ weight: '1 Piece', price: 70 }],
  },
  {
    name: 'White Forest Pastry (Piece)',
    category: 'Pieces',
    imageUrl: '/cakes/white.png',
    description: 'Single slice of white forest vanilla sponge layered with white chocolate curls.',
    prices: [{ weight: '1 Piece', price: 50 }],
  },

  // Full Cakes
  {
    name: 'Black Forest Cake',
    category: 'Chocolate',
    imageUrl: '/cakes/blackforest.png',
    description: 'Classic moist chocolate sponge layered with fresh whipped cream and juicy cherries, topped with dark chocolate curls.',
    prices: [
      { weight: '500g', price: 300 },
      { weight: '1 kg', price: 600 },
    ],
  },
  {
    name: 'White Forest Cake',
    category: 'Vanilla',
    imageUrl: '/cakes/whiteforest.png',
    description: 'Fluffy vanilla sponge cake layered with white chocolate shavings, red cherries, and velvety whipped cream.',
    prices: [
      { weight: '500g', price: 300 },
      { weight: '1 kg', price: 600 },
    ],
  },
  {
    name: 'Oreo Cream Cake',
    category: 'Chocolate',
    imageUrl: '/cakes/oreocake.jpeg',
    description: 'Decadent chocolate sponge layered with crushed Oreo cookie cream and topped with whole Oreo biscuits.',
    prices: [{ weight: '500g', price: 600 }],
  },
  {
    name: 'Ferrero Rocher Cake',
    category: 'Premium',
    imageUrl: '/cakes/ferroro.jpeg',
    description: 'Luxurious hazelnut chocolate cake loaded with real Ferrero Rocher chocolates, Nutella glaze, and roasted hazelnut crunch.',
    prices: [{ weight: '1 kg', price: 1450 }],
  },
  {
    name: 'Pistachio Chocolate Cake',
    category: 'Premium',
    imageUrl: '/cakes/pistachiocake.jpeg',
    description: 'Rich dark chocolate cake infused with creamy pistachio mousse and crushed roasted pistachios.',
    prices: [{ weight: '1 kg', price: 1400 }],
  },
  {
    name: 'Tender Coconut Cake',
    category: 'Specialty',
    imageUrl: '/cakes/tendercoconutcake.jpeg',
    description: 'Fresh and light coconut sponge infused with real tender coconut pulp and soft vanilla cream.',
    prices: [{ weight: '1 kg', price: 1400 }],
  },
  {
    name: 'Dutch Chocolate Cake',
    category: 'Chocolate',
    imageUrl: '/cakes/dutchchoclatecake.jpeg',
    description: 'Deep, rich cocoa layers made with premium Dutch dark cocoa and silky chocolate fudge frosting.',
    prices: [{ weight: '1 kg', price: 1000 }],
  },
  {
    name: 'Choco Butter Cake',
    category: 'Chocolate',
    imageUrl: '/cakes/chocobutterctc.jpeg',
    description: 'Moist golden butter cake layered with rich chocolate buttercream and chocolate drippings.',
    prices: [{ weight: '1 kg', price: 1100 }],
  },
  {
    name: 'Chocolate Coffee Cake',
    category: 'Chocolate',
    imageUrl: '/cakes/chocolatecoffecake.jpeg',
    description: 'Perfect harmony of espresso coffee-infused sponge and rich dark chocolate ganache.',
    prices: [{ weight: '1 kg', price: 900 }],
  },
  {
    name: 'Caramel Nuts Cake',
    category: 'Nuts & Caramel',
    imageUrl: '/cakes/caramelnuts.jpeg',
    description: 'Butterscotch sponge layered with golden salted caramel sauce and crunchy roasted cashews and almonds.',
    prices: [
      { weight: '500g', price: 480 },
      { weight: '1 kg', price: 900 },
    ],
  },
  {
    name: 'Passion Fruit Cake',
    category: 'Fruit',
    imageUrl: '/cakes/passionfruitcake.jpeg',
    description: 'Refreshing tropical passion fruit curd layered between soft vanilla sponges and light cream.',
    prices: [{ weight: '1 kg', price: 800 }],
  },
  {
    name: 'Spanish Delight Cake',
    category: 'Specialty',
    imageUrl: '/cakes/carml.png',
    description: 'Famous Spanish delight cake layered with rich custard, chocolate sauce, and toasted nuts.',
    prices: [
      { weight: '500g', price: 400 },
      { weight: '1 kg', price: 780 },
    ],
  },
  {
    name: 'Pineapple Delight Cake',
    category: 'Fruit',
    imageUrl: '/cakes/pineaappledelight.jpg',
    description: 'Light, juicy vanilla cake filled with fresh chopped pineapples and sweet pineapple glaze.',
    prices: [
      { weight: '500g', price: 480 },
      { weight: '1 kg', price: 780 },
    ],
  },
  {
    name: 'Blueberry Cake',
    category: 'Fruit',
    imageUrl: '/cakes/blueberry.png',
    description: 'Soft vanilla sponge layered with real blueberry compote and light whipped cream.',
    prices: [
      { weight: '500g', price: 400 },
      { weight: '1 kg', price: 780 },
    ],
  },
  {
    name: 'Red Velvet Cake',
    category: 'Red Velvet',
    imageUrl: '/cakes/reveltv.jpg',
    description: 'Classic crimson red velvet cake with velvety cream cheese frosting.',
    prices: [
      { weight: '500g', price: 400 },
      { weight: '1 kg', price: 780 },
    ],
  },
  {
    name: 'Honey Almond Cake',
    category: 'Nuts & Caramel',
    imageUrl: '/cakes/honeyalmoncake.jpeg',
    description: 'Sweet honey-infused cake encrusted with roasted sliced almonds and honey glaze.',
    prices: [{ weight: '1 kg', price: 950 }],
  },
  {
    name: 'KitKat Chocolate Cake',
    category: 'Chocolate',
    imageUrl: '/cakes/kitkatcake.jpeg',
    description: 'Chocolate cake surrounded by crispy KitKat bars and topped with colorful chocolate gems.',
    prices: [{ weight: '1 kg', price: 1200 }],
  },
  {
    name: 'Strawberry Delight Cake',
    category: 'Fruit',
    imageUrl: '/cakes/strwaberrydelight.jpeg',
    description: 'Fresh strawberry compote layered with fluffy vanilla sponge and whipped cream.',
    prices: [
      { weight: '500g', price: 400 },
      { weight: '1 kg', price: 780 },
    ],
  },
]

// ── All static custom cakes from Cakes.jsx CUSTOM_STATIC_CAKES ───────────────
const SEED_CUSTOM_CAKES = [
  { name: 'Custom Design 1', imageUrl: '/custom/1.avif' },
  { name: 'Custom Design 2', imageUrl: '/custom/3.avif' },
  { name: 'Custom Design 3', imageUrl: '/custom/9.avif' },
  { name: 'Custom Design 4', imageUrl: '/custom/10.avif' },
  { name: 'Custom Design 5', imageUrl: '/custom/17.avif' },
  { name: 'Custom Design 6', imageUrl: '/custom/1000796798.jpg.jpeg' },
  { name: 'Custom Design 7', imageUrl: '/custom/1000805921.jpg.jpeg' },
]

async function seed() {
  try {
    await mongoose.connect(mongoURI)
    console.log('✅ Connected to MongoDB for seeding cakes')

    let cakesAdded = 0
    for (const cakeData of SEED_CAKES) {
      const exists = await Cake.findOne({ name: cakeData.name })
      if (!exists) {
        await Cake.create(cakeData)
        console.log(`+ Cake created: ${cakeData.name}`)
        cakesAdded++
      } else {
        console.log(`~ Skipped (exists): ${cakeData.name}`)
      }
    }

    let customAdded = 0
    for (const customData of SEED_CUSTOM_CAKES) {
      const exists = await CustomCake.findOne({ imageUrl: customData.imageUrl })
      if (!exists) {
        await CustomCake.create(customData)
        console.log(`+ Custom cake created: ${customData.name}`)
        customAdded++
      } else {
        console.log(`~ Skipped (exists): ${customData.name}`)
      }
    }

    console.log(`\n🎉 Seeding complete! Added ${cakesAdded} cakes + ${customAdded} custom cake photos.`)
    console.log('You can now edit all of them from the Admin Panel → Cake Collections tab.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err)
    process.exit(1)
  }
}

seed()
