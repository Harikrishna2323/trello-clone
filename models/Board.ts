import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: String,
    orgId: String,
    imageId: String,
    imageThumbUrl: String,
    imageFullUrl: String,
    imageLinkHTML: String,
    imageUserName: String,
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
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

// Middleware to delete related List documents when a Board is removed
// boardSchema.pre("remove", async function (next) {
//   // TODO : Remove type errors
//   try {
//     const board = this;
//     await List.deleteMany({ boardId: this._id });
//     next();
//   } catch (err) {
//     console.log("Cascade Error : ", err);
//     next();
//   }
// });

const Board = mongoose.models?.Board || mongoose.model("Board", boardSchema);

export default Board;
