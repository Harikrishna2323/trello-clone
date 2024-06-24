import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    orgId: String,
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
    },
    entityId: String,
    entityType: {
      type: String,
      enum: ["CARD", "LIST", "BOARD"],
    },
    entityTitle: String,

    userId: String,
    userImage: String,
    userName: String,
  },
  { timestamps: true }
);

const AuditLog =
  mongoose.models?.AuditLog || mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
