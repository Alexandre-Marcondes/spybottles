// src/services/billingService.ts

/**
 * TEMP STUB:
 * Returns true to simulate an active paid user.
 * Replace with real Stripe logic later.
 */
export const fetchStripeStatus = async (userId: string): Promise<boolean> => {
  console.log(`[billing] Simulating Stripe check for user ${userId}`);
  return true; // 🔁 Replace with real Stripe lookup later
};
