// utils/isSuperAdmin.ts
import { Request, Response, NextFunction } from 'express';

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'superAdmin') {
    res.status(403).json({ message: 'Access denied: SuperAdmin only' });
    return;
  }
  next();
};
