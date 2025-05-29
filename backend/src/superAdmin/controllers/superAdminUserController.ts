import { Request, Response } from 'express';
import {
  getAllUsersService,
  createUserService,
  deleteUserByIdService,
} from '../services/superAdminUserService';

/**
 * SuperAdmin: Get all users
 */
export const getAllUsersAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ users });
  } catch (err) {
    console.error('🚫 Get All Users Failed:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * SuperAdmin: Create user (self-paid or companyAdmin)
 */
export const createUserAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, company } = await createUserService(req.body);

    const response = {
      message: '✅ User created successfully',
      user,
      ...(company ? { company } : {}),
    };

    res.status(201).json(response);
  } catch (err: any) {
    console.error('🚫 Create User Failed:', err);
    res.status(400).json({ message: err.message || 'Failed to create user' });
  }
};

/**
 * SuperAdmin: Delete user
 */
export const deleteUserAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await deleteUserByIdService(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: '✅ User deleted successfully' });
  } catch (err) {
    console.error('🚫 Delete User Failed:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
