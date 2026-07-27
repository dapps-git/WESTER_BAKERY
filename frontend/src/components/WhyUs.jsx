import { Award, Clock, Heart, Wheat } from 'lucide-react'

const FEATURES = [
  { icon: <Wheat size={22} />, title: 'Premium Ingredients', desc: 'Sourced from the finest farms and suppliers around the world.' },
  { icon: <Clock size={22} />, title: 'Baked Fresh Daily', desc: 'Every product is made fresh every morning — no exceptions.' },
  { icon: <Award size={22} />, title: 'Award Winning', desc: 'Recognized for excellence in artisan baking since 2010.' },
  { icon: <Heart size={22} />, title: 'Made with Love', desc: 'Each creation carries our passion for the craft of baking.' },
]

export default function WhyUs() {
  return (
    <section id="about" className="py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subheading">Our Promise</p>
          <h2 className="section-heading">Why Choose Us?</h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-brown-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-brown-300" />
            <div className="h-px w-16 bg-brown-200" />
          </div>
          <p className="font-sans font-extralight text-brown-400 text-sm max-w-xl mx-auto mt-5 leading-relaxed">
            We are more than a bakery — we are an experience. Every bite tells a story of tradition, craftsmanship, and love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center p-8 bg-cream-50 rounded-2xl shadow-sm card-hover border border-cream-200"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 mb-4">
                {f.icon}
              </div>
              <h3 className="font-serif text-lg text-brown-800 font-normal mb-2">{f.title}</h3>
              <p className="font-sans text-xs font-extralight text-brown-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
