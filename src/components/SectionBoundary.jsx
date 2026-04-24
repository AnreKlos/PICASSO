import { Component } from 'react'

export default class SectionBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[SectionBoundary:${this.props.name || 'unknown'}]`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section style={{ padding: '60px 20px', textAlign: 'center', opacity: 0.5 }}>
          <p style={{ fontSize: 14, color: '#9A938B' }}>
            Раздел временно недоступен
          </p>
        </section>
      )
    }
    return this.props.children
  }
}
