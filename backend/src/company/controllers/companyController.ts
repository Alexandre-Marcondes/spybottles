import { Request, Response } from 'express';
import {
  createCompanyService,
  getCompanyByIdService,
  updateCompanyService,
  inviteUserToCompanyService,
} from '../services/companyService';

/**
 * Create a new company (manual use by superAdmin)
 */
export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyName } = req.body;
    const user = req.user;

    if (!user || user.role !== 'superAdmin') {
      res.status(403).json({ message: 'Only super admins can create companies' });
      return;
    }

    if (!companyName) {
      res.status(400).json({ message: 'Company name is required' });
      return;
    }

    const company = await createCompanyService({ companyName, createdBy: user.userId });

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
 * Get company by ID (superAdmin or companyAdmin with matching company)
 */
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user || (user.role !== 'superAdmin' && user.currentCompany !== id)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const company = await getCompanyByIdService(id);

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    res.status(200).json({
      _id: company._id,
      companyName: company.companyName,
      tier: company.tier,
      users: company.users, // Optionally filter user output
    });
  } catch (err) {
    console.error('Get Company Error:', err);
    res.status(500).json({ message: 'Failed to fetch company' });
  }
};

/**
 * Update company by ID (superAdmin or matching companyAdmin only)
 */
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user || (user.role !== 'superAdmin' && user.currentCompany !== id)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updatedCompany = await updateCompanyService(id, req.body) as any;

    if (!updatedCompany) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    res.status(200).json({
      companyName: updatedCompany.name,
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
 * Invite user to company (companyAdmin only)
 */
export const inviteUserToCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { id: companyId } = req.params;
    const { email } = req.body;

    if (!user || user.role !== 'companyAdmin' || user.currentCompany !== companyId) {
      res.status(403).json({ message: 'Only company admins can invite users to their company' });
      return;
    }

    if (!email) {
      res.status(400).json({ message: 'Email is required to invite user' });
      return;
    }

    const invite = await inviteUserToCompanyService({ companyId, email });

    res.status(200).json({
      message: `Invitation sent to ${email}`,
      invitedUserId: invite._id,
    });
  } catch (err) {
    console.error('Invite User Error:', err);
    res.status(400).json({ message: 'Failed to invite user' });
  }
};
