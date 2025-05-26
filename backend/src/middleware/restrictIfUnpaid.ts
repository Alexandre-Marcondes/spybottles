import { Request, Response, NextFunction } from 'express';
import { BizUserModel } from '../bizUser/models/bizUserModel';

/**
 * Middleware to block access for unpaid users or companies.
 * Allows superAdmins, paid self-paid users, and users from paid companies.
 */
export const restrictIfUnpaid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;

  // ✅ Allow superAdmin always
  if (user?.role === 'superAdmin') {
    return next();
  }

  // ✅ Self-paid users — check isPaid from injected auth
  if (user?.isSelfPaid) {
    if (user.isPaid) {
      return next();
    } else {
      res.status(402).json({ message: 'Personal subscription required.' });
      return;
    }
  }

  // ❌ No company attached
  if (!user?.currentCompany) {
    res.status(403).json({ message: 'No company context. Access denied.' });
    return;
  }

  try {
    // ✅ Check if their company is paid
    const bizUser = await BizUserModel.findById(user.currentCompany);

    if (!bizUser || !bizUser.isPaid) {
      res.status(402).json({ message: 'Company subscription is required.' });
      return;
    }

    // ✅ All good
    next();
  } catch (err) {
    console.error('Subscription check failed:', err);
    res.status(500).json({ message: 'Error validating subscription.' });
  }
};
