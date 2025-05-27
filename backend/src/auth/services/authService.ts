import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../../user/models/userModel';

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

interface LoginInput {
  email: string;
  password: string;
  companyId?: string;
}

export const loginUserService = async ({ email, password, companyId }: LoginInput) => {
  const user = await UserModel.findOne({ email }).exec() as any;

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  let selectedCompanyId: string | null = null;
  const hasCompanies = Array.isArray(user.companies) && user.companies.length > 0;

  if (user.isSelfPaid) {
    if (companyId) {
      throw new Error('Self-paid users should not provide a companyId.');
    }
  } else {
    if (!hasCompanies) {
      throw new Error('No company associated and user is not self-paid.');
    }

    selectedCompanyId =
      companyId || (user.companies.length === 1 ? user.companies[0].toString() : null);

    if (!selectedCompanyId) {
      throw new Error('Multiple companies found. Please specify companyId.');
    }

    const validCompanyIds = user.companies.map((id: { toString: () => any; }) => id.toString());
    if (!validCompanyIds.includes(selectedCompanyId)) {
      throw new Error('User is not associated with the specified company.');
    }
  }

  // 🎫 Token Payload
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    companies: user.companies,
    currentCompany: selectedCompanyId,
    isSelfPaid: user.isSelfPaid,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: {
      email: user.email,
      role: user.role,
      companies: user.companies,
      currentCompany: selectedCompanyId,
      isSelfPaid: user.isSelfPaid,
      isActive: user.isActive,
    },
  };
};
