import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import emailRouter from "./routes/emails.js";
import paymentsRouter, { stripeWebhook } from "./routes/payments.js";

dotenv.config();
const app = express();
app.use(cors());

// Stripe webhook (raw)
app.post("/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// JSON for the rest
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, name: "CoachMail API" }));
app.use("/api/auth", authRouter);
app.use("/api/emails", emailRouter);
app.use("/api/payments", paymentsRouter);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { dbName: process.env.MONGO_DB || "coachmail" })
  .then(() => app.listen(PORT, () => console.log(`🚀 API on :${PORT}`)))
  .catch(err => { console.error("Mongo error:", err.message); process.exit(1); });
