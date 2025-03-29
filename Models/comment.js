// Models/comment.js
const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "blog" },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const comment = model("comment", CommentSchema);
module.exports = comment;
