import { useState } from 'react'

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  containerClassName = '',
  onError,
  ...props
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${containerClassName}`}>
      {/* Shimmer Skeleton Placeholder while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setError(true)
          if (onError) onError(e)
        }}
        {...props}
      />
    </div>
  )
}
