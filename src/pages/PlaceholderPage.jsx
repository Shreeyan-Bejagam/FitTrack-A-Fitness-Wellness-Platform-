import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/Button'

export function PlaceholderPage({ title }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-dashed border-border p-8 text-center">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">This section is a placeholder in the scaffold.</p>
      <Button variant="outline" className="mt-6" asChild>
        <Link to="/dashboard">Back to overview</Link>
      </Button>
    </div>
  )
}

PlaceholderPage.propTypes = {
  title: PropTypes.string.isRequired,
}
