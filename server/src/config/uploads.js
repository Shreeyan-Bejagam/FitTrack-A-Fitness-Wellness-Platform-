import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cloudinaryPkg from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import { config } from './env.js'
import { ApiError } from '../utils/apiError.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const uploadsRoot = path.join(__dirname, '../../uploads')

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new ApiError(400, 'Only image files allowed'))
  }
  cb(null, true)
}

let cloudinary = null

if (config.useCloudinary) {
  cloudinary = cloudinaryPkg.v2
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
  })
}

function diskStorage(subfolder) {
  const dest = path.join(uploadsRoot, subfolder)
  ensureDir(dest)
  return multer.diskStorage({
    destination: dest,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg'
      cb(null, `${req.user.id}-${Date.now()}${safeExt}`)
    },
  })
}

const avatarStorage = config.useCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'fittrack/avatars',
        allowed_formats: ['jpg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
      },
    })
  : diskStorage('avatars')

const progressStorage = config.useCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'fittrack/progress',
        allowed_formats: ['jpg', 'png', 'webp'],
      },
    })
  : diskStorage('progress')

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('avatar')

export const uploadProgressPhoto = multer({
  storage: progressStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
}).array('photos', 5)

export { cloudinary }

/**
 * @param {import('express').Request} req
 * @param {Express.Multer.File} file
 * @param {'avatars' | 'progress'} folder
 */
export function fileToAsset(req, file, folder) {
  if (config.useCloudinary) {
    return { url: file.path, publicId: file.filename }
  }
  const base = `${req.protocol}://${req.get('host')}`
  return {
    url: `${base}/uploads/${folder}/${file.filename}`,
    publicId: `local/${folder}/${file.filename}`,
  }
}

export function deleteStoredAsset(publicId) {
  if (!publicId) return
  if (publicId.startsWith('local/')) {
    const rel = publicId.replace(/^local\//, '')
    const filePath = path.join(uploadsRoot, rel)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    return
  }
  if (config.useCloudinary && cloudinary) {
    return cloudinary.uploader.destroy(publicId)
  }
}
