import { UserModel } from '../models/userModel';
import { User } from '../models/userModel';

// Create a new user
export const createUserService = async (userData: Partial<User>) => {
  const newUser = new UserModel(userData);
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
export const updateUserByIdService = async (id: string, updateData: Partial<User>) => {
  return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete user by ID
export const deleteUserByIdService = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};
