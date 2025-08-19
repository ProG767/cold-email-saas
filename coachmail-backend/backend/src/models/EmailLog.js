import mongoose from "mongoose";
const EmailLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  to: String, subject: String,
  status: { type: String, enum: ["queued","sent","failed"], default: "queued" },
  error: String, createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("EmailLog", EmailLogSchema);
