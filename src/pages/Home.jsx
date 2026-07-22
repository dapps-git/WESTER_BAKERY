import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'

// In-memory module flag to ensure splash screen only runs ONCE per session
let hasLoadedOnce = false

export default function Home() {
  const [loading, setLoading] = useState(() => {
    if (hasLoadedOnce || sessionStorage.getItem('hasSeenSplash')) {
      return false
    }
    return true
  })

  useEffect(() => {
    if (!loading) return

    const t = setTimeout(() => {
      hasLoadedOnce = true
      try {
        sessionStorage.setItem('hasSeenSplash', 'true')
      } catch {
        /* silent */
      }
      setLoading(false)
    }, 1800)

    return () => clearTimeout(t)
  }, [loading])

  return (
    <>
      {/* Loading Screen — Only shown on initial site visit */}
      <div className={`loading-screen ${loading ? '' : 'hidden'}`}>
        <div className="flex flex-col items-center gap-4">
          <p className="font-serif text-3xl font-light tracking-[0.3em] text-brown-700 animate-pulse">WESTERN</p>
          <p className="font-sans text-[10px] tracking-[0.5em] text-brown-400 uppercase">Bakery &amp; Kitchen</p>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-brown-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero only — full screen, no scrolling */}
      <div className={`h-screen overflow-hidden transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <Hero />
      </div>
    </>
  )
}
