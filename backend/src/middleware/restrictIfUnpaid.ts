import { Request, Response, NextFunction } from 'express';
import { BizUserModel } from '../bizUser/models/bizUserModel';

export const restrictIfUnpaid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;

  if (user?.role === 'superAdmin') {
  return next();
  }

  // ✅ If the user is self-paid, allow access
  if (user?.isSelfPaid) {
    if(user?.isPaid){
      return next();
    }
    else {
      res.status(402).json({message: ' Personal subscription required'});
    }
  }

  // 🧠 Otherwise, check if their currentCompany is paid
  if (!user?.currentCompany) {
    res.status(403).json({ message: 'No company context. Access denied.' });
    return;
  }

  try {
    const bizUser = await BizUserModel.findById(user.currentCompany);

    if (!bizUser || !bizUser.isPaid) {
      res.status(402).json({ message: 'Company subscription is required.' });
      return;
    }

    // ✅ Company is paid — grant access
    next();
  } catch (err) {
    console.error('Subscription check failed:', err);
    res.status(500).json({ message: 'Error validating subscription.' });
  }
};
