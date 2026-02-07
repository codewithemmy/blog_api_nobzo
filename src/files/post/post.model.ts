import { Schema, model } from "mongoose"
import { IPost } from "./post.interface"

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    tags: [String],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

const post = model<IPost>("Post", PostSchema, "post")
export default post
