import { hashPassword } from '../../utils/authUtils';
import mongoose from 'mongoose';
import { UserModel, UserRole } from '../../user/models/userModel';
import { CompanyModel } from '../../company/models/companyModel';

interface BizUserInput {
  email: string;
  password: string;
  companyName: string;
}

/**
 * Creates a new company admin and company together.
 * Assigns role = 'companyAdmin', links user to company, and defaults to 'pro' tier.
 */
export const createBizUserService = async ({
  email,
  password,
  companyName,
}: BizUserInput) => {
  // 🔍 Check for existing user
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // 🔐 Hash password
  const hashedPassword = await hashPassword(password);

  // 👤 Create the new company admin user
  const newUser = new UserModel({
    email,
    password: hashedPassword,
    role: UserRole.CompanyAdmin,
    isSelfPaid: false,
    companies: [],
  });

  await newUser.save();

  // 🏢 Create the company and link to user
  const newCompany = new CompanyModel({
    name: companyName,
    createdBy: newUser._id,
    users: [newUser._id],
    tier: 'pro', // 🟢 Default tier for all company signups
  });

  await newCompany.save();

  // 🔗 Link the company back to the user
  newUser.companies = [newCompany._id as mongoose.Types.ObjectId];
  await newUser.save();

  return {
    user: newUser,
    company: newCompany,
  };
};
