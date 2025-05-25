import crypto from 'crypto';
import { UserModel } from '../models/userModel';
import { sendEmail } from '../../utils/email';
import { hashPassword } from '../../utils/authUtils';

// ✅ Self-paid user signup (Bob only)
export const signupSelfPaidUserService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const hashedPassword = await hashPassword(password);

  const newUser = new UserModel({
    email,
    password: hashedPassword,
    role: 'selfPaidUser',
    isSelfPaid: true,
    companies: [],
  });

  return await newUser.save();
};

// ✅ Update own account
export const updateSelfPaidUserService = async (
  userId: string,
  updateData: Partial<{
    email: string;
    phoneNumber: string;
    location: {
      lat: number;
      long: number;
    };
  }>
) => {
  return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
};

// ✅ Delete own account

 export const deleteSelfPaidUserService = async (userId: string) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    {
      isActive: false,           // 🔒 Soft-delete flag
      deletedAt: new Date(),     // 🕒 Timestamp for record
      subscriptionStatus: 'cancelled', // 📦 Optional: for Stripe sync
    },
    { new: true }
  );
};


// ✅ Forgot password
export const forgotPasswordService = async (email: string): Promise<void> => {
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

// ✅ Reset password
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
