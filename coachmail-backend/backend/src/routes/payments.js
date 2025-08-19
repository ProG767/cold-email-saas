import { Router } from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import { authMiddleware } from "../utils/jwt.js";
const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const priceMap = {
  [process.env.STARTER_PRICE_ID]: { credits: 100, plan: "starter" },
  [process.env.PRO_PRICE_ID]: { credits: 500, plan: "pro" }
};
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=1`,
      metadata: { userId: req.user.userId, priceId }
    });
    res.json({ url: session.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const chosen = priceMap[session?.metadata?.priceId];
    try {
      if (userId && chosen) {
        const user = await User.findById(userId);
        if (user) {
          user.credits += chosen.credits;
          user.plan = chosen.plan;
          user.trialActive = false;
          await user.save();
        }
      }
    } catch (e) { console.error("Webhook update error:", e.message); }
  }
  res.json({ received: true });
};
export default router;
