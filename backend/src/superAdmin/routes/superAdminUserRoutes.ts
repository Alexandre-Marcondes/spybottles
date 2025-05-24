import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { isSuperAdmin } from '../../utils/isSuperAdmin';
import {
  getAllUsersAdmin,
  createUserAsAdmin,
  deleteUserAsAdmin,
} from '../controllers/superAdminUserController';

import {
  SUPER_ADMIN_USER_GET_ALL_PREFIX,
  SUPER_ADMIN_USER_CREATE_PREFIX,
  SUPER_ADMIN_USER_DELETE_PREFIX,
} from '../superAdminUserConstants';

const router = Router();

// Admin GET all users
/**
 * @swagger
 * /v1.0.0/admin/users:
 *   get:
 *     summary: Super Admin - Get all users
 *     tags: [Super Admin User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Access denied
 */
router.get(SUPER_ADMIN_USER_GET_ALL_PREFIX, authenticate, isSuperAdmin, getAllUsersAdmin);

// Admin create user
/**
 * @swagger
 * /v1.0.0/admin/users/create:
 *   post:
 *     summary: Super Admin - Create a new user with any role
 *     tags: [Super Admin User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - birthday
 *               - role
 *               - phoneNumber
 *               - location
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birthday:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [bartender, manager, admin, other]
 *               phoneNumber:
 *                 type: string
 *               bizId:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   long:
 *                     type: number
 *     responses:
 *       201:
 *         description: User created
 *       403:
 *         description: Access denied
 */
router.post(SUPER_ADMIN_USER_CREATE_PREFIX, authenticate, isSuperAdmin, createUserAsAdmin);

// Admin delete user
/**
 * @swagger
 * /v1.0.0/admin/users/{id}:
 *   delete:
 *     summary: Super Admin - Delete a user by ID
 *     tags: [Super Admin User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.delete(SUPER_ADMIN_USER_DELETE_PREFIX, authenticate, isSuperAdmin, deleteUserAsAdmin);

export default router;
