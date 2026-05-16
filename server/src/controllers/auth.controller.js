import * as authService from '../services/auth.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '../utils/token.js'

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body)
  setRefreshTokenCookie(res, result.refreshToken)
  sendSuccess(res, 201, 'Account created', {
    user: result.user,
    accessToken: result.accessToken,
  })
})

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body)
  setRefreshTokenCookie(res, result.refreshToken)
  sendSuccess(res, 200, 'Logged in', {
    user: result.user,
    accessToken: result.accessToken,
  })
})

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken
  const result = await authService.refreshTokens(token)
  setRefreshTokenCookie(res, result.refreshToken)
  sendSuccess(res, 200, 'Token refreshed', { accessToken: result.accessToken })
})

export const logout = asyncHandler(async (req, res) => {
  const rt = req.cookies?.refreshToken
  await authService.logout(req.user.id, rt)
  clearRefreshTokenCookie(res)
  sendSuccess(res, 200, 'Logged out')
})

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id)
  clearRefreshTokenCookie(res)
  sendSuccess(res, 200, 'Logged out from all devices')
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id)
  sendSuccess(res, 200, 'OK', { user })
})
