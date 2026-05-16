import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
)

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, maxlength: 1000 },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    comments: [commentSchema],
    sharedWorkout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
  },
  { timestamps: true },
)

postSchema.index({ createdAt: -1 })

export const Post = mongoose.model('Post', postSchema)
