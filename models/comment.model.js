import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    }, 
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

export const commentModel =
  mongoose.models.comments || mongoose.model("Comment", commentSchema);
