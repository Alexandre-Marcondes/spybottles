import { Request, Response } from 'express';
import { isSelfOrAdmin } from '../../utils/authUtils';
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserByIdService,
  deleteUserByIdService,
} from '../services/userService';

/**
 * Create a new user
 * - Role is forced to 'bartender' (admin role not allowed from this route)
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
  //  ⛔ Prevent malicious role injection
    if (req.body.role === 'admin') {
      res.status(403).json({ message: ' ⛔ Cannot assign admin role' });
      return;
    }

  // ✅ Default role if not provided
    if (!req.body.role) {
      req.body.role = 'bartender';
    }

    const user = await createUserService(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error('Create User Error:', err);
    res.status(400).json({ message: 'Failed to create user' });
  }
};

/**
 * Get all users
 * - TODO: Should be restricted to admin-only access
 */
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (err) {
    console.error('Get Users Error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Get user by ID
 * - ✅ Only allow access if requesting own data OR if admin
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isSelfOrAdmin(req, req.params.id)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const user = await getUserByIdService(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Get User By ID Error:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

/**
 * Update user by ID
 * - ✅ Only allow self or admin to perform updates
 */
export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isSelfOrAdmin(req, req.params.id)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updated = await updateUserByIdService(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(400).json({ message: 'Failed to update user' });
  }
};

/**
 * Delete user by ID
 * - ✅ Only allow self or admin to delete users
 */
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isSelfOrAdmin(req, req.params.id)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const deleted = await deleteUserByIdService(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete User Error:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
