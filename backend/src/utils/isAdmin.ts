import { Request } from 'express';

export const isAdmin = (req: Request): boolean => {
  return req.user?.role === 'admin';
};
