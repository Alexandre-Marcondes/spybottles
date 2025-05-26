import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/auth'; // ✅ Shared type
import { fetchStripeStatus } from '../stripe/services/billingServices'; // ✅ NEW: For dynamic isPaid check

/**
 * Middleware to authenticate users via JWT
 * Adds user object to req.user using shared UserPayload type
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret not configured');

    // ✅ Decode token using shared payload shape
    const decoded = jwt.verify(token, secret) as UserPayload;

    // ✅ NEW: Dynamically fetch isPaid status (from DB or Stripe)
    const isPaid = await fetchStripeStatus(decoded.userId);

    // ✅ Attach to req.user using central UserPayload shape
    req.user = {
      ...decoded,
      isPaid,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
