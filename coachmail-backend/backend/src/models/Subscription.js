import mongoose from "mongoose";
const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  plan: { type: String, enum: ["starter", "pro"] },
  stripeSubscriptionId: String,
  currentPeriodEnd: Date,
  status: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Subscription", SubscriptionSchema);
