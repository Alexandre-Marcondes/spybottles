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

export const loginUserService = async (credentials: LoginInput) => {
  const { email, password, companyId } = credentials;

  // 🔍 Find the user
  const user = await UserModel.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  // ✅ Handle company or self-paid access
  let selectedCompanyId: string | null = null;

  if (user.isSelfPaid && companyId) {
  throw new Error('Self-paid users should not provide a companyId.');
 }

  const hasCompanies = Array.isArray(user.companies) && user.companies.length > 0;

  if (hasCompanies) {
    selectedCompanyId =
      companyId || (user.companies.length === 1 ? user.companies[0].toString() : null);

    if (!selectedCompanyId) {
      throw new Error('Multiple companies found. Please specify companyId.');
    }

    const companyIds = user.companies.map((id) => id.toString());
    if (!companyIds.includes(selectedCompanyId)) {
      throw new Error('User is not associated with the specified company.');
    }
  } else if (!user.isSelfPaid) {
    // ❌ Neither self-paid nor connected to a company
    throw new Error('No company associated and user is not self-paid.');
  }

  // 🎫 Token Payload
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    companies: user.companies,
    currentCompany: selectedCompanyId,
    isSelfPaid: user.isSelfPaid,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  // ✅ Send response
  return {
    token,
    user: {
      userId: user._id,
      email: user.email,
      role: user.role,
      currentCompany: selectedCompanyId,
      companies: user.companies,
      isSelfPaid: user.isSelfPaid,
      isActive: user.isActive,
    },
  };
};
