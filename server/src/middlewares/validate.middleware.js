import { ApiError } from '../utils/apiError.js'

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const issues = result.error.flatten().fieldErrors
      const list = Object.entries(issues).map(([field, msgs]) => ({
        field,
        message: msgs?.[0] || 'Invalid',
      }))
      return next(new ApiError(422, 'Validation failed', list))
    }
    req.body = result.data
    next()
  }
}
