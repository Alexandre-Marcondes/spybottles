import { Request, Response } from 'express';
import {
  signupSelfPaidUserService,
  updateSelfPaidUserService,
  deleteSelfPaidUserService,
  forgotPasswordService,
  resetPasswordService,
} from '../services/userService';

/**
 * Self-paid user signup (Bob)
 * - No admin, role, or companyId allowed
 */
export const createSelfPaidUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const newUser = await signupSelfPaidUserService({ email, password });

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Self-paid signup error:', err);
    res.status(400).json({ message: 'Failed to create account' });
  }
};

/**
 * Update self-paid user profile (Bob)
 */
export const updateOwnAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const updatedUser = await updateSelfPaidUserService(userId, req.body);

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Update self-paid user error:', err);
    res.status(400).json({ message: 'Failed to update account' });
  }
};

/**
 * Delete your own self-paid account (Bob)
 */
export const deleteOwnAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await deleteSelfPaidUserService(userId);

    res.status(200).json({ message: 'Your account has been deleted' });
  } catch (err) {
    console.error('Delete self-paid user error:', err);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

/**
 * Forgot password
 */
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    await forgotPasswordService(email);

    res.status(200).json({
      message: 'If an account exists for that email, a reset link has been sent.',
    });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Failed to process password reset' });
  }
};

/**
 * Reset password
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: 'Token and new password are required' });
      return;
    }

    const success = await resetPasswordService(token, newPassword);

    if (!success) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};
