import User from "../models/User.js";
export const ensureCredits = async (userId, amount=1) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  const now = new Date();
  const trialOk = user.trialActive && user.trialExpires && now <= user.trialExpires;
  const hasCredits = user.credits >= amount || (trialOk && user.credits >= amount);
  return hasCredits ? { ok: true, user } : { ok: false, reason: "NO_CREDITS" };
};
export const decrementCredits = async (userId, amount=1) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  user.credits = Math.max(0, user.credits - amount);
  if (user.trialActive && user.trialExpires && new Date() > user.trialExpires) user.trialActive = false;
  await user.save(); return user.credits;
};
