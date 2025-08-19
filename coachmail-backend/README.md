# CoachMail – Backend MVP
API Express + MongoDB + JWT + Stripe + Credits + Email sending.

## Local
cd backend
cp .env.example .env  # remplir les variables
npm install
npm start

## Endpoints
POST /api/auth/register
POST /api/auth/login
POST /api/emails/send   (Bearer <token>)
POST /api/payments/checkout (Bearer <token>, body { priceId })
POST /webhook/stripe

## Railway
- Deploy from GitHub
- Add MongoDB (Railway plugin ou Mongo Atlas)
- Add env vars (voir .env.example)
- Start command: npm start
- Configure Stripe webhook -> https://<railway>/webhook/stripe
