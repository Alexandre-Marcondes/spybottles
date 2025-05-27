import { CompanyModel } from '../models/companyModel';
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

// ✏️ Update company (only allowed fields)
export const updateCompanyService = async (
  id: string,
  updates: Partial<{
    name: string;
    tier: string;
    logo: string;
  }>,
  isWebhook = false // ✅ Add flag to explicitly allow tier update
) => {
  const allowedUpdates = { ...updates };

  // 🔐 Strip tier unless it's coming from a webhook (Stripe)
  if (!isWebhook) {
    delete (allowedUpdates as any).tier;
  }

  return await CompanyModel.findByIdAndUpdate(id, allowedUpdates, { new: true });
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
