import { CompanyModel, Company } from '../models/companyModel';
import { UserModel, UserRole } from '../../user/models/userModel';
import { hashPassword } from '../../utils/authUtils';
import mongoose from 'mongoose';

// 🏗️ Create a new company (used by superAdmin or during bizUser sign-up)
export const createCompanyService = async ({
  companyName,
  createdBy,
}: {
  companyName: string;
  createdBy: string;
}) => {
  const company = new CompanyModel({
    name: companyName, // 👈 use `name` not `companyName`
    createdBy,
    users: [createdBy],
    tier: 'pro', // ✅ Default tier
    isActive: true,
  });

  return await company.save();
};

// 🔍 Get company by ID, include user emails and roles
export const getCompanyByIdService = async (id: string) => {
  return await CompanyModel.findById(id).populate('users', 'email role');
};

export const updateCompanyService = async ({
  companyId,
  updateData,
  role,
}: {
  companyId: string;
  updateData: Partial<Company>;
  role: string;
}): Promise<Partial<Company>> => {
  const allowedFields: (keyof Pick<Company, 'companyName' | 'locations'>)[] = [
    'companyName',
    'locations',
  ];

  let safeUpdateData: Partial<Company> = {};

  if (role === UserRole.SuperAdmin) {
    // SuperAdmin can update anything
    safeUpdateData = updateData;
  } else {
    // Only allow companyName and locations for companyAdmin
    for (const key of allowedFields) {
      if (key in updateData) {
        safeUpdateData[key] = updateData[key] as any;
      }
    }
  }

  if (Object.keys(safeUpdateData).length === 0) {
    throw new Error('No valid fields to update');
  }

  const updatedCompany = await CompanyModel.findByIdAndUpdate(
    companyId,
    safeUpdateData,
    { new: true }
  );

  if (!updatedCompany) {
    throw new Error('Company not found');
  }

  return updatedCompany;
};

// 👥 Invite a user to a company
export const inviteUserToCompanyService = async ({
  companyId,
  email,
}: {
  companyId: string;
  email: string;
}) => {
  let user = await UserModel.findOne({ email });

  if (!user) {
    // ✨ Create a new user with temp password
    const tempPassword = 'changeme123'; // 🔐 Replace with real invite token later
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
    // 🔁 Add to company if not already included
    const companyObjectId = new mongoose.Types.ObjectId(companyId);
    if (!user.companies.some((id) => id.equals(companyObjectId))) {
      user.companies.push(companyObjectId);
      await user.save();
    }
  }

  // 🧩 Ensure user is linked on the company side
  await CompanyModel.findByIdAndUpdate(companyId, {
    $addToSet: { users: user._id },
  });

  // 📧 (Future) Send invite email here

  return user;
};
