import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  credits: { type: Number, default: 0 },
  trialActive: { type: Boolean, default: true },
  trialExpires: { type: Date, default: () => new Date(Date.now() + (Number(process.env.TRIAL_DAYS || 15)) * 86400000) },
  plan: { type: String, enum: ["starter", "pro", null], default: null },
  stripeCustomerId: { type: String },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("User", UserSchema);
