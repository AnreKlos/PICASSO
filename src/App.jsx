import { lazy, Suspense, Component } from 'react'
import { Routes, Route } from 'react-router-dom'

const Picasso = lazy(() => import('./Picasso.jsx'))

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#0E0C0B', color: '#F0EBE3', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2>Runtime Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#D4213D' }}>{this.state.error?.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#9A938B', fontSize: 12 }}>{this.state.error?.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden w-screen h-[100dvh]"
      style={{ background: '#0E0C0B' }}
    >
      <div
        className="text-sm uppercase tracking-[0.3em] animate-pulse select-none"
        style={{ color: '#9A938B', fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        Загрузка...
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/*" element={<Picasso />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
