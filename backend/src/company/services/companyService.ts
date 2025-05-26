import { CompanyModel } from '../models/companyModel';
import { UserModel, UserRole } from '../../user/models/userModel';
import { hashPassword } from '../../utils/authUtils';
import mongoose from 'mongoose';

// Create a new company
export const createCompanyService = async ({
  companyName,
  createdBy,
}: {
  companyName: string;
  createdBy: string;
}) => {
  const company = new CompanyModel({
    companyName,
    createdBy,
    users: [createdBy],
  });

  return await company.save();
};

// Get company by ID
export const getCompanyByIdService = async (id: string) => {
  return await CompanyModel.findById(id).populate('users', 'email role');
};

// Update company
export const updateCompanyService = async (
  id: string,
  updates: Partial<{
    companyName: string;
    tier: string;
    logo: string;
    isActive: boolean;
  }>
) => {
  return await CompanyModel.findByIdAndUpdate(id, updates, { new: true });
};

// Invite user to company
export const inviteUserToCompanyService = async ({
  companyId,
  email,
}: {
  companyId: string;
  email: string;
}) => {
  // Check if user exists
  let user = await UserModel.findOne({ email });

  if (!user) {
    const tempPassword = 'changeme123'; // or generate temporary code
    const hashedPassword = await hashPassword(tempPassword);

    user = new UserModel({
      email,
      password: hashedPassword,
      role: UserRole.Bartender,
      isSelfPaid: false,
      companies: [companyId],
      isActive: true,
    });

    await user.save();
  } else {
    // User exists — just add to company if not already
    if (!user.companies.includes(new mongoose.Types.ObjectId(companyId))) {
      user.companies.push(new mongoose.Types.ObjectId(companyId));
      await user.save();
    }
  }

  // Update company.users list
  await CompanyModel.findByIdAndUpdate(companyId, {
    $addToSet: { users: user._id },
  });

  // 🔜 You’d send the invite email here
  return user;
};
