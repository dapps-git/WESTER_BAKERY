import { Star } from 'lucide-react'

const REVIEWS = [
  { name: 'Aisha K.', stars: 5, review: 'Absolutely the best croissants I have ever tasted. The layers are perfectly flaky and the butter flavour is divine.' },
  { name: 'Rajan M.', stars: 5, review: 'Ordered a custom birthday cake and it exceeded all expectations. The design was stunning and it tasted even better.' },
  { name: 'Priya S.', stars: 5, review: 'Their shawarma and biryani are unlike any bakery I have visited. Truly a complete kitchen experience.' },
  { name: 'Danish A.', stars: 5, review: 'Every visit feels premium. The ambiance, the freshness, the staff — everything is world class.' },
]

export default function Reviews() {
  return (
    <section className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-subheading">Testimonials</p>
          <h2 className="section-heading">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-brown-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-brown-300" />
            <div className="h-px w-16 bg-brown-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              className="bg-cream-100 rounded-2xl p-7 border border-cream-200 card-hover"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={13} className="fill-brown-400 text-brown-400" />
                ))}
              </div>
              <p className="font-sans font-extralight text-brown-500 text-sm leading-relaxed mb-5 italic">"{r.review}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brown-200 flex items-center justify-center font-serif text-brown-700 text-sm">
                  {r.name[0]}
                </div>
                <p className="font-serif text-sm text-brown-700 font-normal">{r.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
