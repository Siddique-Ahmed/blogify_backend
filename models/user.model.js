import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("User", userSchema);
