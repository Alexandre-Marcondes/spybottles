import { Request } from 'express';
import bcrypt from 'bcrypt';
/**
 * Returns true if the user making the request is either:
 * - the user matching the `targetUserId`, or
 * - an admin
 */
export const isSelfOrAdmin = (req: Request, targetUserId: string): boolean => {
  return req.user?.userId === targetUserId || req.user?.role === 'admin';
};

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, 10);
};
