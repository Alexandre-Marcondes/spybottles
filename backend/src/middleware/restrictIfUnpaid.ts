import { Request, Response, NextFunction } from 'express';
import { CompanyModel } from '../company/models/companyModel';

/**
 * Middleware: Restrict access if the user or their company is unpaid.
 * 
 * - ✅ Allows superAdmins by default
 * - ✅ Allows self-paid users (checked via user.isPaid)
 * - ✅ Allows company users if their currentCompany is marked as isPaid
 */
export const restrictIfUnpaid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;
  
  if (!user) {
    return next();
  }
  console.log('🔎 currentCompany from token:', user.currentCompany);


  // 🛡 Allow SuperAdmins to bypass payment checks
  if (user?.role === 'superAdmin') {
    return next();
  }
  
  // 🧾 Self-paid individual users
  if (user?.isSelfPaid) {
    if (user.isPaid) {
      return next();
    } else {
      res.status(402).json({ message: 'Self-paid subscription required.' });
      return;
    }
  }

  // ❌ Block if no current company is attached to the token
  if (!user?.currentCompany) {
    res.status(403).json({ message: 'No company context. Access denied.' });
    return;
  }

  try {
    // 🏢 Company-based user: Check if their company is paid
    const company = await CompanyModel.findById(user.currentCompany);

    if (!company || !company.isPaid) {
      res.status(402).json({ message: 'Company subscription is required.' });
      return;
    }

    // ✅ All checks passed
    next();
  } catch (err) {
    console.error('Subscription check failed:', err);
    res.status(500).json({ message: 'Error validating subscription.' });
  }
};
