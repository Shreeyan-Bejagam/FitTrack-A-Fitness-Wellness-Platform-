import { ApiError } from '../utils/apiError.js'

export function errorMiddleware(err, req, res, next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'
  /** @type {unknown | null} */
  let errors = err.errors ?? null

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    errors = err.errors?.length ? err.errors : null
  } else if (err.name === 'ValidationError') {
    statusCode = 422
    message = 'Validation failed'
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }))
  } else if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
  } else if (err.code === 11000) {
    statusCode = 409
    message = 'Already exists'
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    errors = [{ field, message: 'Duplicate value' }]
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  } else if (
    /invalid signature/i.test(message) ||
    /cloudinary/i.test(message) ||
    err.http_code === 401
  ) {
    statusCode = 502
    message =
      'Image upload is not configured. Set valid Cloudinary credentials or USE_LOCAL_UPLOADS=true for local storage.'
  } else if (process.env.NODE_ENV === 'production') {
    message = 'Internal server error'
  }

  const body = { success: false, message }
  if (errors != null) body.errors = errors
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    body.stack = err.stack
  }

  res.status(statusCode).json(body)
}
