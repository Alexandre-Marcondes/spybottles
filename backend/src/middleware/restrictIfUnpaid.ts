import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../user/models/userModel';

// /**
//  * Middleware to block access if user does not have an active subscription.
//  */
// export const restrictIfUnpaid = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const userId = req.user?.userId;

//   if (!userId) {
//     res.status(401).json({ message: 'Unauthorized' });
//     return;
//   }

//   const user = await UserModel.findById(userId);

//   if (!user || !user.isPaid) {
//     res.status(403).json({ message: 'Subscription required' });
//     return;
//   }

//   next();
// };

const FREE_USER_EMAILS = ['bartender@bar.com', 'alexmarcondes1111@gmil.com'];

export const restrictIfUnpaid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = await UserModel.findById(userId);

  // ✅ Allow admin users
  if (user?.role === 'admin') {
    return next();
  }

  // ✅ Allow free email list
  if (FREE_USER_EMAILS.includes(user?.email || '')) {
    return next();
  }

  // ⛔ Block unpaid users
  if (!user?.isPaid) {
    res.status(403).json({ message: 'Subscription required' });
    return;
  }

  next();
};
