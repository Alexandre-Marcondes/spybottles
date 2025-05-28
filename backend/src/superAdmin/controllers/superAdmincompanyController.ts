import { Request, Response } from 'express';
import { createCompanyService } from '../services/superAdminCompanyServices';
import { UserPayload } from '../../types/auth';

export const createCompanyAsSuperAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { companyName } = req.body;
    const user = req.user as UserPayload;

    if (!user?.userId) {
      res.status(401).json({ message: 'Unauthorized: No user ID found' });
      return;
    }

    const newCompany = await createCompanyService({
      companyName,
      createdBy: user.userId,
    });

    res.status(201).json({ message: 'Company created', company: newCompany });
  } catch (err: any) {
    console.error('❌ Company creation failed:', err.message);
    res.status(400).json({ message: 'Failed to create company' });
  }
};
