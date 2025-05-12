import { UserModel } from '../../user/models/userModel';
import { logger } from '../../utils/logger';

/**
 * Updates the user's subscription status in the database.
 * @param email - Email address used in the Stripe session
 * @param isPaid - Whether the subscription is active
 */
export const updateUserSubscriptionStatus = async (
  email: string,
  isPaid: boolean
): Promise<void> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { email },
      { isPaid },
      { new: true }
    );

    if (!user) {
      logger.warn(`User with email ${email} not found during Stripe update.`);
      return;
    }

    logger.info(`User ${email} subscription updated: isPaid = ${isPaid}`);
  } catch (error) {
    logger.error(`Error updating user subscription: ${error}`);
    throw error;
  }
};
