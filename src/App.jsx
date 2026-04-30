import { Component, useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'

import BeautyTemplate from './templates/beauty-master/BeautyTemplate.jsx'
import NotFound from './components/NotFound.jsx'
import { defaultConfig } from './configs/_default.config.js'
import { getClientConfig } from './lib/clientConfigResolver.js'

function ClientSiteRoute() {
  const { slug } = useParams()
  const [state, setState] = useState({ loading: true, config: null })

  useEffect(() => {
    const config = getClientConfig(slug)
    setState({ loading: false, config: config || defaultConfig })
  }, [slug])

  if (state.loading) {
    return null
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
        <Route path="/" element={<BeautyTemplate config={defaultConfig} />} />
        <Route path="/:slug" element={<ClientSiteRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}