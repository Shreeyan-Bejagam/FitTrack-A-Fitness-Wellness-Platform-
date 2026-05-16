import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'

export function generateAccessToken(userId) {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN })
}

export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.JWT_SECRET)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.JWT_REFRESH_SECRET)
}

const refreshCookieOptions = {
  httpOnly: true,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: config.NODE_ENV === 'production',
  // Cross-origin (Netlify + separate API host) needs None; local dev uses Strict.
  sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
}

export function setRefreshTokenCookie(res, token) {
  res.cookie('refreshToken', token, refreshCookieOptions)
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie('refreshToken', refreshCookieOptions)
}
