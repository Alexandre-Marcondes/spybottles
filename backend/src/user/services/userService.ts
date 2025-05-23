import crypto from 'crypto';
import { UserModel } from '../models/userModel';
import { User } from '../models/userModel';
import { sendEmail } from '../../utils/email';
import { hashPassword } from '../../utils/authUtils';

// Create a new user
export const createUserService = async (
  userData: Partial<User>
) => {
  if (!userData.password) {
    throw new Error('Password is required');
  }

  const hashedPassword = await hashPassword(userData.password);
  const newUser = new UserModel({
    ...userData,
    password: hashedPassword,
  });

  return await newUser.save();
};

// Get all users
export const getAllUsersService = async () => {
  return await UserModel.find();
};

// Get one user by ID
export const getUserByIdService = async (id: string) => {
  return await UserModel.findById(id);
};

// Update user by ID
export const updateUserByIdService = async (
  id: string,
  updateData: Partial<User>
) => {
  return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete user by ID
export const deleteUserByIdService = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};

// Forgot password: generate token and email user
export const forgotPasswordService = async (
  email: string
): Promise<void> => {
  const user = await UserModel.findOne({ email });
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  user.resetToken = resetToken;
  user.resetTokenExpires = tokenExpires;
  await user.save();

  const resetUrl = `https://yourapp.com/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Your password reset link',
    text: `Click the link to reset your password: ${resetUrl}`,
  });
};

// Reset password using a token
export const resetPasswordService = async (
  token: string,
  newPassword: string
): Promise<boolean> => {
  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!user) return false;

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();
  return true;
};