import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-6"
      style={{ background: '#0E0C0B', color: '#F0EBE3' }}
    >
      <div className="max-w-md w-full text-center">
        <p
          className="text-[12px] uppercase tracking-[0.35em] mb-5"
          style={{ color: '#C9A87A' }}
        >
          Picasso Demo
        </p>
        <h1 className="font-picasso-display text-3xl sm:text-4xl leading-tight">
          Демо не найдено
        </h1>
        <p className="mt-4 text-sm sm:text-base" style={{ color: '#9A938B' }}>
          Проверьте ссылку или откройте основное демо салона PICASSO.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center mt-8 px-7 py-3 text-[12px] uppercase tracking-[0.14em] font-medium transition-transform hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(to bottom, #e0c490 0%, #c9a87a 40%, #9f7f52 100%)',
            color: '#0E0C0B',
            borderRadius: 9999,
            boxShadow:
              '0 4px 20px rgba(201,168,122,0.18), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.15)',
          }}
        >
          Открыть основное демо
        </Link>
      </div>
    </div>
  )
}

export default NotFound
