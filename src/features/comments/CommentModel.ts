import {Schema, model} from "mongoose";

const commentSchema = new Schema({
  body: {
    type: String,
    maxLength: 2048,
    required: true,
  },
  relatedPostId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Comment = model("Comment", commentSchema);

export default Comment;
