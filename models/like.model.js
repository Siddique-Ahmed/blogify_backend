import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
}, { timestamps: true });

export const likeModel =
  mongoose.models.likes || mongoose.model("Like", likeSchema);
