import mongoose from 'mongoose'

const measurementsSchema = new mongoose.Schema(
  {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number,
  },
  { _id: false },
)

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    weight: { type: Number },
    weightUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    bodyFatPercentage: { type: Number },
    muscleMass: { type: Number },
    measurements: measurementsSchema,
    notes: { type: String },
    photos: [
      {
        url: String,
        publicId: String,
      },
    ],
  },
  { timestamps: true },
)

progressSchema.index({ user: 1, date: 1 }, { unique: true })

export const Progress = mongoose.model('Progress', progressSchema)
