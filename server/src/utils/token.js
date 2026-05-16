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

export function setRefreshTokenCookie(res, token) {
  const maxAge = 7 * 24 * 60 * 60 * 1000
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    path: '/',
  })
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie('refreshToken', { path: '/', httpOnly: true, sameSite: 'strict' })
}
