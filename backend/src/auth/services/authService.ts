import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel, User } from '../../user/models/userModel';
import { PopulatedUser } from '../../user/models/userModel';

// 🔐 Ensure JWT_SECRET is present
if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

// 🧾 Input type for login
interface LoginInput {
  email: string;
  password: string;
}

// 🔐 Login service: Validates credentials and returns token + user context
export const loginUserService = async ({ email, password }: LoginInput) => {
  // 📦 Fetch user by email
  const user = await UserModel.findOne({ email })
    .populate('companies', 'companyName') // Optional: pulls in company names
    .exec() as unknown as PopulatedUser;

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  const hasCompanies = Array.isArray(user.companies) && user.companies.length > 0;

  let selectedCompanyId: string | null = null;

  // 👤 Self-paid users must not have companies
  if (user.isSelfPaid) {
    if (hasCompanies) {
      throw new Error('Self-paid users should not belong to any company.');
    }
  } else {
    // 🏢 Company user: must have at least one company
    if (!hasCompanies) {
      throw new Error('No company associated with user and not self-paid.');
    }

    // ✅ Auto-select if only one company, otherwise return null (frontend should prompt)
    selectedCompanyId =
      user.companies.length === 1 ? user.companies[0]._id.toString() : null;
  }

  // 🎫 JWT payload
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    companies: user.companies.map((company: any) => company._id),
    currentCompany: selectedCompanyId,
    isSelfPaid: user.isSelfPaid,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: {
      email: user.email,
      role: user.role,
      isSelfPaid: user.isSelfPaid,
      isActive: user.isActive,
      currentCompany: selectedCompanyId,
      companies: user.companies,
    },
  };
};
