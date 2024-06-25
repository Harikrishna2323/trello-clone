import mongoose from "mongoose";

const OrgLimitSchema = new mongoose.Schema(
  {
    orgId: {
      type: String,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const OrgLimit =
  mongoose.models?.OrgLimit || mongoose.model("OrgLimit", OrgLimitSchema);

export default OrgLimit;
