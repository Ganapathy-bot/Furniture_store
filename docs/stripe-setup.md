# Stripe Checkout Setup

## 1. Get API Keys

1. Create or open your Stripe account.
2. Go to Developers > API keys.
3. Copy the secret key into `.env` as `STRIPE_SECRET_KEY`.

## 2. Configure Environment

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLIENT_URL=http://localhost:5173
```

## 3. Local Webhook

Install the Stripe CLI, then run:

```bash
stripe login
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

Copy the webhook signing secret into `.env` as `STRIPE_WEBHOOK_SECRET`.

## 4. Test Checkout

1. Register or login as a customer.
2. Add items to the cart.
3. Proceed to checkout.
4. Fill the shipping address.
5. Pay with Stripe using test card `4242 4242 4242 4242`, any future expiry, and any CVC.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/v1/orders` | Create order and Stripe Checkout Session |
| GET | `/api/v1/orders` | User order history |
| GET | `/api/v1/orders/:id` | Order detail |
| POST | `/api/v1/orders/verify-session` | Verify after Stripe redirect |
| POST | `/api/webhooks/stripe` | Stripe payment webhook |

## Flow

```text
Cart -> Checkout -> Stripe Hosted Checkout -> /orders/success -> Order confirmed
                                           |
                                           +-> Webhook updates order and sends email
```
