import mongoose from "mongoose";
import Board from "./Board";
import Card from "./Card";

const ListSchema = new mongoose.Schema(
  {
    title: String,
    order: Number,
    boardId: String,
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      require: true,
    },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
        unique: true,
      },
    ],
  },
  { timestamps: true }
);

ListSchema.pre("save", async function (next) {
  if (this.isNew) {
    await Board.findByIdAndUpdate(
      this.boardId,
      {
        $push: { lists: this._id },
      },
      { new: true }
    );
  }
  next();
});

const List = mongoose.models?.List || mongoose.model("List", ListSchema);

export default List;
