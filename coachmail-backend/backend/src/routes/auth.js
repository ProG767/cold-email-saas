import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signJwt } from "../utils/jwt.js";
const router = Router();
const TRIAL_CREDITS = Number(process.env.TRIAL_CREDITS || 30);
const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || 15);
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });
    const exist = await User.findOne({ email });
    if (exist) return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const trialExpires = new Date(Date.now() + TRIAL_DAYS * 86400000);
    const user = await User.create({ email, passwordHash, credits: TRIAL_CREDITS, trialActive: true, trialExpires });
    const token = signJwt({ userId: user._id, email: user.email });
    res.json({ token, user: { email: user.email, credits: user.credits, trialExpires } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signJwt({ userId: user._id, email: user.email });
    res.json({ token, user: { email: user.email, credits: user.credits, plan: user.plan } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
export default router;
