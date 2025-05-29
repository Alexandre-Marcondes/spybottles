import { Request } from 'express';

export const isCompanyAdmin = (req: Request): boolean => {
  return req.user?.role === 'companyAdmin';
};

export const isSuperAdmin = (req: Request): boolean => {
  return req.user?.role === 'superadmin';
};
