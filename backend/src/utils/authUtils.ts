import { Request } from 'express';
import bcrypt from 'bcrypt';
import { Role } from '../types/roles';

/**
 * Returns true if the user making the request is either:
 * - the user matching the `targetUserId`, or
 * - a companyAdmin or superAdmin
 */
export const isSelfOrAdmin = (req: Request, targetUserId: string): boolean => {
  const role = req.user?.role;
  return req.user?.userId === targetUserId ||
    role === 'companyAdmin' ||
    role === 'superAdmin';
};

/**
 * Hashes a plain text password with bcrypt
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, 10);
};
