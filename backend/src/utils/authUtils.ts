import { Request } from 'express';

/**
 * Returns true if the user making the request is either:
 * - the user matching the `targetUserId`, or
 * - an admin
 */
export const isSelfOrAdmin = (req: Request, targetUserId: string): boolean => {
  return req.user?.userId === targetUserId || req.user?.role === 'admin';
};
