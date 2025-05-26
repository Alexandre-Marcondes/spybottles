import { Request, Response } from 'express';
import {
  createCompanyService,
  getCompanyByIdService,
  updateCompanyService,
  inviteUserToCompanyService,
} from '../services/companyService';

/**
 * Create a new company
 */
export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyName } = req.body;
    const createdBy = req.user?.userId;

    if (!companyName) {
      res.status(400).json({ message: 'Missing name or authentication' });
      return;
    }

    const company = await createCompanyService({ companyName, createdBy });

    res.status(201).json({
      _id: company._id,
      companyName: company.companyName,
      tier: company.tier,
    });
  } catch (err) {
    console.error('Create Company Error:', err);
    res.status(400).json({ message: 'Failed to create company' });
  }
};

/**
 * Get company by ID
 */
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const company = await getCompanyByIdService(id);

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    res.status(200).json({
      _id: company._id,
      companyName: company.companyName,
      tier: company.tier,
      users: company.users, // optionally filter out sensitive info per user
    });
  } catch (err) {
    console.error('Get Company Error:', err);
    res.status(500).json({ message: 'Failed to fetch company' });
  }
};

/**
 * Update company by ID
 */
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedCompany = await updateCompanyService(id, req.body);

    if (!updatedCompany) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    res.status(200).json({
      companyName: updatedCompany.companyName,
      tier: updatedCompany.tier,
      logo: updatedCompany.logo,
      isActive: updatedCompany.isActive,
    });
  } catch (err) {
    console.error('Update Company Error:', err);
    res.status(400).json({ message: 'Failed to update company' });
  }
};

/**
 * Invite user to company
 */
export const inviteUserToCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: companyId } = req.params;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required to invite user' });
      return;
    }

    const invite = await inviteUserToCompanyService({ companyId, email });

    res.status(200).json({
      message: `Invitation sent to ${email}`,
      invitedUserId: invite._id, // Optional
    });
  } catch (err) {
    console.error('Invite User Error:', err);
    res.status(400).json({ message: 'Failed to invite user' });
  }
};
