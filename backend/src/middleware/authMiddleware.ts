import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express's Request type to include 'user'
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to authenticate JWT tokens from Authorization header
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret not configured');

    const decoded = jwt.verify(token, secret);

    // Attach decoded token to request object
    req.user = decoded;

    next(); // Proceed to next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
