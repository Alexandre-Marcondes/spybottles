import { Request, Response } from 'express';
import { isSuperAdmin } from '../../utils/isSuperAdmin';
import {
  getAllUsersService,
  createUserService,
  deleteUserByIdService,
} from '../services/superAdminUserService'; // Reuse your user services

/**
 * Admin: Get all users
 */
export const getAllUsersAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (err) {
    console.error('Admin Get All Users Error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Admin: Create user with any role
 */
export const createUserAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Admin Create User Error:', err);
    res.status(400).json({ message: 'Failed to create user' });
  }
};

/**
 * Admin: Delete user by ID
 */
export const deleteUserAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await deleteUserByIdService(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Admin Delete User Error:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
