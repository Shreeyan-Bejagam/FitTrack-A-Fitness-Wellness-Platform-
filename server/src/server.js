import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config/env.js'
import { isOriginAllowed } from './config/cors.js'
import { uploadsRoot } from './config/uploads.js'
import { connectDB } from './config/db.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { apiLimiter } from './middlewares/rateLimit.middleware.js'
import { sendSuccess } from './utils/response.js'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import workoutRoutes from './routes/workout.routes.js'
import nutritionRoutes from './routes/nutrition.routes.js'
import progressRoutes from './routes/progress.routes.js'
import communityRoutes from './routes/community.routes.js'

const app = express()

await connectDB()

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
if (!config.useCloudinary) {
  app.use('/uploads', express.static(uploadsRoot))
}
app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) return callback(null, true)
      console.warn(`CORS blocked origin: ${origin}`)
      callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/v1', apiLimiter)

app.get('/api/v1/health', (req, res) => {
  sendSuccess(res, 200, 'OK', {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/workouts', workoutRoutes)
app.use('/api/v1/nutrition', nutritionRoutes)
app.use('/api/v1/progress', progressRoutes)
app.use('/api/v1/community', communityRoutes)

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Not found: ${req.method} ${req.path}` })
})

app.use(errorMiddleware)

const server = app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`)
})

export { app, server }
