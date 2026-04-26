import { Component, useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'

import BeautyTemplate from './BeautyTemplate.jsx'
import NotFound from './components/NotFound.jsx'
import { picassoConfig } from './configs/picasso.config.js'

const configModules = import.meta.glob('./configs/*.config.js')

function resolveModuleConfig(moduleValue) {
  if (!moduleValue || typeof moduleValue !== 'object') return null
  if (moduleValue.default && typeof moduleValue.default === 'object') return moduleValue.default

  for (const value of Object.values(moduleValue)) {
    if (value && typeof value === 'object') {
      return value
    }
  }

  return null
}

function SlugPicassoRoute() {
  const { slug } = useParams()
  const [state, setState] = useState({ loading: true, config: null, found: false })

  useEffect(() => {
    const key = `./configs/${String(slug || '').trim().toLowerCase()}.config.js`
    const loader = configModules[key]

    if (!loader) {
      setState({ loading: false, config: null, found: false })
      return
    }

    let cancelled = false
    setState({ loading: true, config: null, found: true })

    loader()
      .then((moduleValue) => {
        if (cancelled) return
        const resolved = resolveModuleConfig(moduleValue)
        if (!resolved) {
          setState({ loading: false, config: null, found: false })
          return
        }
        setState({ loading: false, config: resolved, found: true })
      })
      .catch(() => {
        if (!cancelled) {
          setState({ loading: false, config: null, found: false })
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (state.loading) {
    return null
  }

  if (!state.found || !state.config) {
    return <NotFound />
  }

  return <BeautyTemplate config={state.config} />
}

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

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<BeautyTemplate config={picassoConfig} />} />
        <Route path="/:slug" element={<SlugPicassoRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}