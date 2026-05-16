import mongoose from 'mongoose'

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    portion: { type: Number },
    portionUnit: { type: String, enum: ['g', 'ml', 'oz', 'serving'], default: 'g' },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  { _id: true },
)

const mealSchema = new mongoose.Schema(
  {
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snacks'] },
    foods: [foodSchema],
  },
  { _id: false },
)

function computeTotals(meals) {
  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  for (const m of meals || []) {
    for (const f of m.foods || []) {
      totalCalories += f.calories || 0
      totalProtein += f.protein || 0
      totalCarbs += f.carbs || 0
      totalFat += f.fat || 0
    }
  }
  return { totalCalories, totalProtein, totalCarbs, totalFat }
}

const nutritionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    meals: [mealSchema],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 },
  },
  { timestamps: true },
)

nutritionLogSchema.index({ user: 1, date: 1 }, { unique: true })

nutritionLogSchema.pre('save', function () {
  const t = computeTotals(this.meals)
  this.totalCalories = t.totalCalories
  this.totalProtein = t.totalProtein
  this.totalCarbs = t.totalCarbs
  this.totalFat = t.totalFat
})

export const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema)
