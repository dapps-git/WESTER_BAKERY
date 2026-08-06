import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Category from './models/Category.js'
import Product from './models/Product.js'

dotenv.config()

const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://westernbakehouseptb_db_user:westernbakery@cluster0.jsfljpe.mongodb.net/WESTERNBAKERY?appName=Cluster0'

// ── All categories ──────────────────────────────────────────────────────────
const SEED_CATEGORIES = [
  { name: 'Biryani',        icon: '🍲' },
  { name: 'Shawarma',       icon: '🥙' },
  { name: 'Alfham & Shawai',icon: '🔥' },
  { name: 'Lime & Mojitos', icon: '🥤' },
  { name: 'Fresh Juices',   icon: '🧃' },
  { name: 'Tea & Coffee',   icon: '☕' },
  { name: 'Snacks',         icon: '🥐' },
  { name: 'Sandwich',       icon: '🥪' },
  { name: 'Burger',         icon: '🍔' },
  { name: 'Fried Chicken',  icon: '🍗' },
  { name: 'Pizza',          icon: '🍕' },
]

// ── All products from DEMO_FOOD in ProductsSection.jsx ──────────────────────
// Note: Items with "options" (Pizza, Alfham) are stored as separate DB records
// (one per size), matching the existing backend Product schema.
const SEED_PRODUCTS = [
  // ── BIRYANI ──
  { name: 'Biriyani Half',     categoryName: 'Biryani',  price: 120, imageUrl: 'https://res.cloudinary.com/fpmj7xap/image/upload/v1785323764/westernbakery/products/bctd8zsmkrfmsjkwjk0u.webp', description: 'Biryani is a mixed rice dish traditionally made with rice, meat (chicken, goat, beef), seafood (prawns or fish), or vegetables, and spices.' },
  { name: 'Biriyani Full',     categoryName: 'Biryani',  price: 150, imageUrl: 'https://res.cloudinary.com/fpmj7xap/image/upload/v1785323799/westernbakery/products/zpnpcixcbuozbqpodc6m.webp', description: 'Biryani is a mixed rice dish traditionally made with rice, meat (chicken, goat, beef), seafood (prawns or fish), or vegetables, and spices.' },
  { name: 'Half Rice',         categoryName: 'Biryani',  price: 60,  imageUrl: 'https://res.cloudinary.com/fpmj7xap/image/upload/v1785323835/westernbakery/products/bhw0lg2dajbgiijktv1d.webp', description: 'Biryani is a mixed rice dish traditionally made with rice, meat (chicken, goat, beef), seafood (prawns or fish), or vegetables, and spices.' },
  { name: 'Full Rice',         categoryName: 'Biryani',  price: 80,  imageUrl: 'https://res.cloudinary.com/fpmj7xap/image/upload/v1785323867/westernbakery/products/rhipcyser29hdyv84j8b.webp', description: 'Biryani is a mixed rice dish traditionally made with rice, meat (chicken, goat, beef), seafood (prawns or fish), or vegetables, and spices.' },

  // ── SHAWARMA ──
  { name: 'Pani Puri Shawarma',       categoryName: 'Shawarma', price: 120, imageUrl: '/food/panipurishawarma.webp', description: 'Unique fusion of crunchy Pani Puri spices & tangy mint chutney stuffed inside juicy chicken shawarma.' },
  { name: 'Shawarma Roll',            categoryName: 'Shawarma', price: 90,  imageUrl: '/food/shawarmaroll.webp',    description: 'Classic Arabic chicken shawarma wrapped in soft rumali bread with garlic sauce.' },
  { name: 'Shawarma Plate',           categoryName: 'Shawarma', price: 110, imageUrl: '/food/shawarmaplate.webp',  description: 'Juicy shredded chicken shawarma served on a plate with kubbus, french fries, and garlic dip.' },
  { name: 'Shawarma Special Roll',    categoryName: 'Shawarma', price: 110, imageUrl: '/food/shawarmasproll.webp', description: 'Extra loaded chicken shawarma roll stuffed with extra meat and double garlic sauce.' },
  { name: 'Shawarma Special Plate',   categoryName: 'Shawarma', price: 130, imageUrl: '/food/shawarmaspplate.webp',description: 'Premium loaded chicken shawarma plate served with extra meat, cheese, fries, and dips.' },

  // ── ALFHAM & SHAWAI (stored as Q/H/F variants) ──
  { name: 'Honey Chilli Alfham (Quarter)', categoryName: 'Alfham & Shawai', price: 130, imageUrl: '/food/honeychillialfham.webp', description: 'Charcoal grilled Alfham chicken coated with spicy red chilli and sweet honey glaze.' },
  { name: 'Honey Chilli Alfham (Half)',    categoryName: 'Alfham & Shawai', price: 250, imageUrl: '/food/honeychillialfham.webp', description: 'Charcoal grilled Alfham chicken coated with spicy red chilli and sweet honey glaze.' },
  { name: 'Honey Chilli Alfham (Full)',    categoryName: 'Alfham & Shawai', price: 570, imageUrl: '/food/honeychillialfham.webp', description: 'Charcoal grilled Alfham chicken coated with spicy red chilli and sweet honey glaze.' },
  { name: 'Peri Peri Alfham (Quarter)',    categoryName: 'Alfham & Shawai', price: 130, imageUrl: '/food/periperialfham.webp',   description: 'Fiery African Peri Peri seasoned chicken grilled over live charcoal.' },
  { name: 'Peri Peri Alfham (Half)',       categoryName: 'Alfham & Shawai', price: 250, imageUrl: '/food/periperialfham.webp',   description: 'Fiery African Peri Peri seasoned chicken grilled over live charcoal.' },
  { name: 'Peri Peri Alfham (Full)',       categoryName: 'Alfham & Shawai', price: 500, imageUrl: '/food/periperialfham.webp',   description: 'Fiery African Peri Peri seasoned chicken grilled over live charcoal.' },
  { name: 'Normal Alfham (Quarter)',       categoryName: 'Alfham & Shawai', price: 125, imageUrl: '/food/normalaflham.webp',     description: 'Classic Arabian charcoal grilled Alfham chicken served with garlic paste & kubbus.' },
  { name: 'Normal Alfham (Half)',          categoryName: 'Alfham & Shawai', price: 240, imageUrl: '/food/normalaflham.webp',     description: 'Classic Arabian charcoal grilled Alfham chicken served with garlic paste & kubbus.' },
  { name: 'Normal Alfham (Full)',          categoryName: 'Alfham & Shawai', price: 480, imageUrl: '/food/normalaflham.webp',     description: 'Classic Arabian charcoal grilled Alfham chicken served with garlic paste & kubbus.' },
  { name: 'Normal Shawai (Quarter)',       categoryName: 'Alfham & Shawai', price: 125, imageUrl: '/food/normalshawai.webp',     description: 'Tender rotisserie roasted chicken marinated in aromatic Middle Eastern spices.' },
  { name: 'Normal Shawai (Half)',          categoryName: 'Alfham & Shawai', price: 240, imageUrl: '/food/normalshawai.webp',     description: 'Tender rotisserie roasted chicken marinated in aromatic Middle Eastern spices.' },
  { name: 'Normal Shawai (Full)',          categoryName: 'Alfham & Shawai', price: 480, imageUrl: '/food/normalshawai.webp',     description: 'Tender rotisserie roasted chicken marinated in aromatic Middle Eastern spices.' },

  // ── LIME & MOJITOS ──
  { name: 'Mint Lime',          categoryName: 'Lime & Mojitos', price: 30, imageUrl: '/drinks/mintlime.webp',       description: 'Refreshing chilled fresh lime juice crushed with garden mint leaves.' },
  { name: 'Green Apple Lime',   categoryName: 'Lime & Mojitos', price: 50, imageUrl: '/drinks/greenapple.webp',    description: 'Zesty lime juice blended with sweet green apple flavor.' },
  { name: 'Fresh Lime',         categoryName: 'Lime & Mojitos', price: 20, imageUrl: '/drinks/freshlime.webp',     description: 'Chilled refreshing fresh lime juice made with real lemons and fresh mint leaves.' },
  { name: 'Grape Lime',         categoryName: 'Lime & Mojitos', price: 30, imageUrl: '/drinks/grapelime.webp',     description: 'Cool lime juice blended with sweet black grape flavor.' },
  { name: 'Blue Lime Cooler',   categoryName: 'Lime & Mojitos', price: 40, imageUrl: '/drinks/bluelime.webp',      description: 'Exotic blue curacao lime cooler served ice cold.' },
  { name: 'Pineapple Lime',     categoryName: 'Lime & Mojitos', price: 30, imageUrl: '/drinks/pineapplelime.webp', description: 'Tropical fresh pineapple juice infused with a tangy twist of fresh lime.' },

  // ── FRESH JUICES ──
  { name: 'Apple Juice',         categoryName: 'Fresh Juices', price: 80, imageUrl: '/drinks/applejuice.webp',        description: 'Freshly extracted sweet red apple juice served chilled.' },
  { name: 'Anar Juice',          categoryName: 'Fresh Juices', price: 80, imageUrl: '/drinks/anarjuice.webp',         description: 'Rich natural juice pressed from fresh pomegranate seeds.' },
  { name: 'Avocado Shake',       categoryName: 'Fresh Juices', price: 80, imageUrl: '/drinks/avacadojuice.webp',      description: 'Creamy, rich and thick fresh butterfruit (avocado) shake.' },
  { name: 'Mosambi Juice',       categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/mosambijuice.webp',      description: 'Freshly squeezed sweet lime juice packed with Vitamin C.' },
  { name: 'Orange Juice',        categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/orange.webp',            description: '100% natural freshly squeezed sweet orange juice.' },
  { name: 'Pineapple Juice',     categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/pineapplejuice.webp',   description: 'Sweet and tangy juice crushed from fresh pineapples.' },
  { name: 'Chikku Juice',        categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/chikkujuice.webp',       description: 'Deliciously thick and sweet sapota (chikku) shake.' },
  { name: 'Mango Juice',         categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/mangojuice.webp',        description: 'Luscious thick juice made from sweet ripe mangoes.' },
  { name: 'Papaya Juice',        categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/pappayajuice.webp',      description: 'Smooth and nutritious fresh papaya blend.' },
  { name: 'Grape Juice',         categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/grapejuice.webp',        description: 'Refreshing chilled black grape juice.' },
  { name: 'Shamam Juice',        categoryName: 'Fresh Juices', price: 70, imageUrl: '/drinks/shamamjuice.webp',       description: 'Cooling fresh muskmelon (shamam) juice.' },
  { name: 'Watermelon Juice',    categoryName: 'Fresh Juices', price: 50, imageUrl: '/drinks/watermelonjuice.webp',  description: 'Hydrating fresh red watermelon juice.' },
  { name: 'Tender Coconut Juice',categoryName: 'Fresh Juices', price: 80, imageUrl: '/drinks/tendercoconutjuice.webp',description: 'Pure fresh tender coconut pulp blended smoothie.' },

  // ── TEA & COFFEE ──
  { name: 'Black Tea', categoryName: 'Tea & Coffee', price: 10, imageUrl: '/drinks/blacktea.webp', description: 'Hot aromatic brewed strong black tea.' },
  { name: 'Tea',       categoryName: 'Tea & Coffee', price: 15, imageUrl: '/drinks/tea.webp',      description: 'Traditional hot cardamom milk tea.' },
  { name: 'Lemon Tea', categoryName: 'Tea & Coffee', price: 15, imageUrl: '/drinks/lemontea.webp', description: 'Hot black tea infused with fresh citrus lemon juice.' },

  // ── SNACKS ──
  { name: 'Egg Puffs',       categoryName: 'Snacks', price: 25, imageUrl: '/food/eggpuffs.png',      description: 'Freshly baked golden flaky puff pastry stuffed with spiced egg masala.' },
  { name: 'Veg Puffs',       categoryName: 'Snacks', price: 20, imageUrl: '/food/vegpuffs.jpg',       description: 'Flaky baked puff filled with delicious spiced potato and mixed vegetable filling.' },
  { name: 'Chicken Puffs',   categoryName: 'Snacks', price: 35, imageUrl: '/food/chickenpuffs.png',   description: 'Crispy layered pastry packed with juicy, spiced chicken filling.' },
  { name: 'Veg Cutlet',      categoryName: 'Snacks', price: 50, imageUrl: '/food/vegcutlet.jpg',       description: 'Crispy deep-fried mashed vegetable cutlet seasoned with aromatic spices.' },
  { name: 'Chicken Cutlet',  categoryName: 'Snacks', price: 20, imageUrl: '/food/chickencutlet.webp',  description: 'Tender minced chicken cutlet coated in breadcrumbs and fried to golden perfection.' },
  { name: 'Chicken Roll',    categoryName: 'Snacks', price: 35, imageUrl: '/food/chickenroll.webp',    description: 'Savory fried roll stuffed with shredded chicken masala and herbs.' },
  { name: 'Glazed Donut',    categoryName: 'Snacks', price: 15, imageUrl: '/food/donut.png',           description: 'Soft, fluffy golden glazed donut topped with sweet strawberry frosting and cocoa sprinkles.' },

  // ── SANDWICH ──
  { name: 'Chicken Sandwich',  categoryName: 'Sandwich', price: 90, imageUrl: '/food/chickensandwich.png', description: 'Toasted triple layered sandwich filled with grilled chicken breast, mayo, and fresh lettuce.' },
  { name: 'Veg Sandwich',      categoryName: 'Sandwich', price: 60, imageUrl: '/food/vegsandwich.jpg',      description: 'Classic grilled sandwich packed with fresh cucumber, tomato, and mint chutney.' },
  { name: 'Omelette Sandwich', categoryName: 'Sandwich', price: 70, imageUrl: '/food/omlettesandwich.jpg',  description: 'Fluffy spiced egg omelette stuffed between toasted buttered bread slices with avocado & cheese.' },

  // ── BURGER ──
  { name: 'Veg Burger',     categoryName: 'Burger', price: 80,  imageUrl: '/food/vegburger.webp',     description: 'Crispy vegetable patty topped with lettuce, onions, and creamy mayo in a soft toasted bun.' },
  { name: 'Chicken Burger', categoryName: 'Burger', price: 100, imageUrl: '/food/chickenburger.webp', description: 'Juicy chicken patty layered with cheddar cheese, fresh lettuce, and house burger sauce.' },

  // ── FRIED CHICKEN ──
  { name: 'Fried Chicken (2 Pieces)', categoryName: 'Fried Chicken', price: 140, imageUrl: '/food/fried2.png',  description: '2 pieces of crispy, golden drumsticks fried to perfection.' },
  { name: 'Fried Chicken (5 Pieces)', categoryName: 'Fried Chicken', price: 300, imageUrl: '/food/fried5.avif', description: '5 pieces of juicy and crispy fried chicken served with garlic dip.' },
  { name: 'Fried Chicken (9 Pieces)', categoryName: 'Fried Chicken', price: 500, imageUrl: '/food/fried9.webp', description: '9 pieces family bucket of hot & crispy fried chicken.' },

  // ── PIZZA (stored as Small/Big variants) ──
  { name: 'Chicken Pizza (Small)', categoryName: 'Pizza', price: 230, imageUrl: '/food/chickenpizza.jpg', description: 'Mozzarella cheese pizza topped with seasoned chicken, onions, and capsicum.' },
  { name: 'Chicken Pizza (Big)',   categoryName: 'Pizza', price: 300, imageUrl: '/food/chickenpizza.jpg', description: 'Mozzarella cheese pizza topped with seasoned chicken, onions, and capsicum.' },
  { name: 'Veg Pizza (Small)',     categoryName: 'Pizza', price: 170, imageUrl: '/food/vegpizza.jpg',     description: 'Fresh sourdough pizza loaded with mozzarella cheese, tomatoes, sweet corn, and olives.' },
  { name: 'Veg Pizza (Big)',       categoryName: 'Pizza', price: 250, imageUrl: '/food/vegpizza.jpg',     description: 'Fresh sourdough pizza loaded with mozzarella cheese, tomatoes, sweet corn, and olives.' },
]

async function seed() {
  try {
    await mongoose.connect(mongoURI)
    console.log('✅ Connected to MongoDB for food seeding')

    // Ensure all categories exist
    const categoryMap = {}
    for (const catData of SEED_CATEGORIES) {
      let cat = await Category.findOne({ name: catData.name })
      if (!cat) {
        cat = await Category.create(catData)
        console.log(`+ Category created: ${cat.name}`)
      } else {
        console.log(`~ Category exists: ${cat.name}`)
      }
      categoryMap[catData.name] = cat._id
    }

    // Seed products (skip if already exists by name)
    let added = 0
    let skipped = 0
    for (const prodData of SEED_PRODUCTS) {
      const catId = categoryMap[prodData.categoryName]
      if (!catId) {
        console.warn(`⚠ No category found for: ${prodData.categoryName}`)
        continue
      }
      const exists = await Product.findOne({ name: prodData.name })
      if (!exists) {
        await Product.create({
          name: prodData.name,
          category: catId,
          price: prodData.price,
          description: prodData.description || '',
          imageUrl: prodData.imageUrl,
        })
        console.log(`+ Product created: ${prodData.name} (₹${prodData.price})`)
        added++
      } else {
        skipped++
      }
    }

    console.log(`\n🎉 Food seeding complete! Added ${added} products, skipped ${skipped} existing.`)
    console.log('All items are now editable from the Admin Panel → Food Products tab.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err)
    process.exit(1)
  }
}

seed()
