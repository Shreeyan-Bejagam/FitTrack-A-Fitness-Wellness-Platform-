import mongoose from 'mongoose'

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    weightUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    restSeconds: { type: Number },
    completed: { type: Boolean, default: false },
    notes: { type: String },
  },
  { _id: true },
)

function sumVolume(exercises) {
  return exercises.reduce((sum, ex) => {
    const s = ex.sets || 0
    const r = ex.reps || 0
    const w = ex.weight || 0
    return sum + s * r * w
  }, 0)
}

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['strength', 'cardio', 'hiit', 'flexibility', 'sport', 'other'],
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    duration: { type: Number },
    exercises: [exerciseSchema],
    totalVolume: { type: Number, default: 0 },
    caloriesBurned: { type: Number },
    notes: { type: String },
    completedAt: { type: Date },
    isTemplate: { type: Boolean, default: false },
  },
  { timestamps: true },
)

workoutSchema.pre('save', function () {
  if (this.exercises?.length) {
    this.totalVolume = sumVolume(this.exercises)
  }
})

export const Workout = mongoose.model('Workout', workoutSchema)
