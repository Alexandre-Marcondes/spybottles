import { Request, Response } from 'express';
import { createBizUserService } from '../services/bizUserService';

/**
 * Register a new company admin (biz user) and create their company.
 * This route does NOT require authentication.
 */
export const createBizUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, companyName } = req.body;

    // 🔐 Validate required fields
    if (!email || !password || !companyName) {
      res.status(400).json({ message: 'Email, password, and company name are required.' });
      return;
    }

    // 🏗 Create the user + company (tier = 'pro' by default)
    const { user, company } = await createBizUserService({
      email,
      password,
      companyName,
    });

    // ✅ Respond with basic details
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
