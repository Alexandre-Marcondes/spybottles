import { Request, Response } from 'express';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { updateUserSubscriptionStatus } from '../services/stripeService';

// Init Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

// 👇 Used to capture raw body for webhook validation
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];

  if (!sig || typeof sig !== 'string') {
    res.status(400).send('Missing Stripe signature');
    return;
  }

  let event;

  try {
    const rawBody = (req as any).rawBody || await buffer(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send('Webhook signature verification failed');
    return;
  }

  // ✅ Handle relevant events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_email;
    if (customerEmail) {
      await updateUserSubscriptionStatus(customerEmail, true);
      console.log(`✅ Subscription activated for ${customerEmail}`);
    }
  }

  res.status(200).send('Webhook received');
};
