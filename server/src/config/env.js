import dotenv from 'dotenv'

dotenv.config()

function isCloudinaryConfigured() {
  if (process.env.USE_LOCAL_UPLOADS === 'true') return false
  const name = process.env.CLOUDINARY_CLOUD_NAME || ''
  const key = process.env.CLOUDINARY_API_KEY || ''
  const secret = process.env.CLOUDINARY_API_SECRET || ''
  if (!name || !key || !secret) return false
  if (name === 'dev_placeholder' || name.includes('your_cloud')) return false
  if (secret.includes('placeholder') || secret.length < 20) return false
  return true
}

const useCloudinary = isCloudinaryConfigured()

const required = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL']
if (useCloudinary) {
  required.push('CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET')
}

for (const key of required) {
  if (!process.env[key] || String(process.env[key]).trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters')
}
if (process.env.JWT_REFRESH_SECRET.length < 32) {
  throw new Error('JWT_REFRESH_SECRET must be at least 32 characters')
}

export const config = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  useCloudinary,
}
