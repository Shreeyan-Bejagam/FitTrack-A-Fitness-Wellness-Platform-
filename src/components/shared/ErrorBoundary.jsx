import PropTypes from 'prop-types'
import { Component } from 'react'
import { Button } from '@/components/shared/Button'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center"
          role="alert"
        >
          <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            We hit a snag loading this section. You can try again — your data is safe.
          </p>
          <Button variant="primary" onClick={this.handleRetry}>
            Try again
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}
