import jwt from 'jsonwebtoken';
import { UserModel } from '../../user/models/userModel'; // Adjust the path to your actual UserModel

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

interface LoginInput {
  email: string;
  password: string;
}

export const loginUserService = async (credentials: LoginInput) => {
  const { email, password } = credentials;

  const user = await UserModel.findOne({ email });

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber,
    birthday: user.birthday,
    bizId: user.bizId || null,         // ✅ optional
    location: user.location || null,   // ✅ optional fallback
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: {
      userId: user._id,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    },
  };
};
