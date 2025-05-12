import { Router } from 'express';
import { stripeWebhook } from '../controllers/stripeController';
import { STRIPE_WEBHOOK_PATH } from '../stripeConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/stripe/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags:
 *       - Stripe
 *     description: Handles Stripe events (e.g. subscription updates)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post(STRIPE_WEBHOOK_PATH, stripeWebhook);

export default router;
