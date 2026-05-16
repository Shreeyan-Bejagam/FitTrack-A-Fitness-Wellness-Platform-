import mongoose from 'mongoose'
import { hashPassword, comparePassword as bcryptCompare } from '../utils/password.js'

const emailRegex = /^\S+@\S+\.\S+$/

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: emailRegex,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      match: /^[a-z0-9_]+$/,
    },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    bio: { type: String, maxlength: 160, default: '' },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'nonbinary', 'prefer_not_to_say'],
    },
    height: {
      value: { type: Number },
      unit: { type: String, enum: ['cm', 'ft'] },
    },
    weight: {
      value: { type: Number },
      unit: { type: String, enum: ['kg', 'lbs'] },
    },
    fitnessGoals: [
      {
        type: String,
        enum: [
          'lose_weight',
          'build_muscle',
          'stay_active',
          'improve_flexibility',
          'eat_healthier',
          'reduce_stress',
        ],
      },
    ],
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'athlete'],
    },
    notifications: {
      workoutReminders: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true },
      communityActivity: { type: Boolean, default: false },
    },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    accentColor: { type: String, default: 'indigo' },
    isEmailVerified: { type: Boolean, default: false },
    refreshTokens: { type: [String], select: false, default: [] },
  },
  { timestamps: true },
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await hashPassword(this.password)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcryptCompare(candidatePassword, this.password)
}

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase().trim() }).select('+password')
}

export const User = mongoose.model('User', userSchema)
