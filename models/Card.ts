import mongoose from "mongoose";
import List from "./List";

const CardSchema = new mongoose.Schema(
  {
    title: String,
    order: Number,
    description: String,

    listId: String,
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
  },
  {
    timestamps: true,
  }
);

CardSchema.pre("save", async function (next) {
  if (this.isNew) {
    await List.findByIdAndUpdate(
      this.listId,
      {
        $push: { cards: this._id },
      },
      { new: true }
    );
  }
  next();
});

// CardSchema.pre("save", async function (next) {
//   if (!this.isModified("listId") || !this.isModified("list")) {
//     return next();
//   }

//   try {
//     const card = this;

//     // Find the old list and remove the card from its cards array
//     const oldList = await List.findById(card.list);
//     if (oldList) {
//       await List.findByIdAndUpdate(card.list, {
//         $pull: { cards: card._id },
//       });
//     }

//     // Find the new list and add the card to its cards array
//     await List.findByIdAndUpdate(card.listId, {
//       $push: { cards: card._id },
//     });

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Card = mongoose.models?.Card || mongoose.model("Card", CardSchema);

export default Card;
