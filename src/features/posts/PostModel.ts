import { Schema, model } from "mongoose";

const postSchema = new Schema({
  body: {
    type: String,
    max: 4096,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: {
    type: [String],
    default: [""],
  },
  tags: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  hashtags: {
    type: [{ type: String }],
    default: [],
  },
});

const Post = model("Post", postSchema);

export default Post;
