import mongoose from 'mongoose'
import { config } from './env.js'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(config.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`)
    process.exit(1)
  }

  mongoose.connection.on('connected', () => console.log('Mongoose connected'))
  mongoose.connection.on('error', (err) => console.error('Mongoose error:', err.message))
  mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'))
}
