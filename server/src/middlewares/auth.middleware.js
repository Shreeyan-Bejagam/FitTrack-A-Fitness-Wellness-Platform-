import { ApiError } from '../utils/apiError.js'
import { verifyAccessToken } from '../utils/token.js'

export function protect(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authenticated')
    }
    const token = header.slice(7)
    const decoded = verifyAccessToken(token)
    req.user = { id: decoded.userId }
    next()
  } catch (e) {
    if (e instanceof ApiError) return next(e)
    next(new ApiError(401, 'Token expired or invalid'))
  }
}

export function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      req.user = null
      return next()
    }
    const token = header.slice(7)
    const decoded = verifyAccessToken(token)
    req.user = { id: decoded.userId }
    next()
  } catch {
    req.user = null
    next()
  }
}
