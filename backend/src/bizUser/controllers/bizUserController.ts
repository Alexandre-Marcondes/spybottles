import { Request, Response } from 'express';
import { createBizUserService } from '../services/bizUserService';

/**
 * Create a new company admin (biz user)
 */
export const createBizUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, companyName, phoneNumber } = req.body;

    if (!email || !password || !companyName || !phoneNumber) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const { user, company } = await createBizUserService({
      email,
      password,
      companyName,
      phoneNumber,
    });

    res.status(201).json({
      email: user.email,
      role: user.role,
      companyId: company._id,
    });
  } catch (err) {
    console.error('Create BizUser Error:', err);
    res.status(400).json({ message: 'Failed to create biz user' });
  }
};
