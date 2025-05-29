// src/middleware/authenticate.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserPayload } from '../types/auth'; // 👈 Shape: userId, email, role, etc.

/**
 * Universal JWT middleware that checks user identity and role
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // 🛑 No token provided
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  // 🔐 Extract token
  const token = authHeader.split(' ')[1];

  try {
    // 🔍 Validate & decode token
    const decoded = jwt.verify(token, config.jwtSecret) as unknown;

    // ✅ Type guard: confirm expected fields
    if (
      typeof decoded !== 'object' ||
      !decoded ||
      !('userId' in decoded) ||
      !('email' in decoded) ||
      !('role' in decoded)
    ) {
      res.status(401).json({ message: 'Malformed token payload' });
      return;
    }

    // ✅ Attach user to req
    req.user = decoded as UserPayload;

    // 👀 Dev log only
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔐 Authenticated: ${req.user.email} (${req.user.role})`);
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
