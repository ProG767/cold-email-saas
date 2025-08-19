import { Router } from "express";
import { authMiddleware } from "../utils/jwt.js";
import { ensureCredits, decrementCredits } from "../utils/creditManager.js";
import EmailLog from "../models/EmailLog.js";
import { sendMail } from "../utils/mailer.js";
const router = Router();
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    if (!to || !subject || (!html && !text)) return res.status(400).json({ error: "Missing fields" });
    const check = await ensureCredits(req.user.userId, 1);
    if (!check.ok) return res.status(402).json({ error: "No credits. Please upgrade." });
    const log = await EmailLog.create({ userId: req.user.userId, to, subject, status: "queued" });
    try {
      const info = await sendMail({ to, subject, html, text });
      await decrementCredits(req.user.userId, 1);
      log.status = "sent"; await log.save();
      res.json({ ok: true, messageId: info.messageId });
    } catch (err) {
      log.status = "failed"; log.error = err.message; await log.save();
      res.status(500).json({ error: "Send failed", details: err.message });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});
export default router;
