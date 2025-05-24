import crypto from 'crypto';
import { UserModel, User } from '../../user/models/userModel';
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

// Delete user by ID
export const deleteUserByIdService = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};
