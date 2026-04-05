import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
  console.warn('STRIPE_SECRET_KEY environment variable is not set');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});
