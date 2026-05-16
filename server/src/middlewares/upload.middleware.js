export { uploadAvatar, uploadProgressPhoto } from '../config/cloudinary.js'

export function runUpload(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) return next(err)
      next()
    })
  }
}
