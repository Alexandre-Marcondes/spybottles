import { UserModel, UserRole } from '../../user/models/userModel';
import { CompanyModel } from '../../company/models/companyModel';
import { hashPassword } from '../../utils/authUtils';
import mongoose from 'mongoose';

interface AdminUserInput {
  email: string;
  password: string;
  role: 'selfPaidUser' | 'companyAdmin';
  companyName?: string; // Required for companyAdmin
}

export const createUserService = async ({
  email,
  password,
  role,
  companyName,
}: AdminUserInput) => {
  // 🧠 1. Check for existing user by email
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error('Email already in use');

  // 🔒 2. Hash the password
  const hashed = await hashPassword(password);

  // 🏗️ 3. Create the user document
  const user = new UserModel({
    email,
    password: hashed,
    role,
    isSelfPaid: role === 'selfPaidUser',
    companies: [],
  });

  await user.save();
  // 🏢 4. If companyAdmin, create associated company
  if (role === 'companyAdmin') {
    if (!companyName) throw new Error('Company name is required for companyAdmin');

    const company = new CompanyModel({
      name: companyName,
      createdBy: user._id,
      users: [user._id],
      tier: 'pro',
    });

    await company.save();

    // 🔗 5. Link company to user
    user.companies = [company._id as mongoose.Types.ObjectId];
    await user.save();

    return { user, company };
  }
  // ✅ 6. Return user only (for selfPaidUser)
  return { user };
};

// Get all users
export const getAllUsersService = async () => {
  return await UserModel.find();
};

// Soft-delete user instead of permanent removal
export const deleteUserByIdService = async (id: string) => {
  return await UserModel.findByIdAndUpdate(
    id,
    {
      isActive: false,           // 💤 Flag user as inactive
      deletedAt: new Date(),     // 🕒 Keep track of when deletion happened
      subscriptionStatus: 'cancelled', // 💳 Optional: handle Stripe logic later
    },
    { new: true }
  );
};


