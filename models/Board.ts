import mongoose, { Schema } from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: String,
  },
  {
    timestamps: true,
  }
);

boardSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
boardSchema.set("toJSON", {
  virtuals: true,
});

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);

export default Board;
