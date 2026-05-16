import rateLimit from 'express-rate-limit'

const jsonHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests, try again later',
  })
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})
