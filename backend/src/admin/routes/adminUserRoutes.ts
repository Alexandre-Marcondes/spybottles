import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { isAdmin } from '../../utils/isAdmin';
import {
  getAllUsersAdmin,
  createUserAsAdmin,
  deleteUserAsAdmin,
} from '../controllers/adminUserController';

import {
  ADMIN_USER_GET_ALL_PREFIX,
  ADMIN_USER_CREATE_PREFIX,
  ADMIN_USER_DELETE_PREFIX,
} from '../adminUserConstants';

const router = Router();

// Admin GET all users
/**
 * @swagger
 * /v1.0.0/admin/users:
 *   get:
 *     summary: Admin - Get all users
 *     tags: [Admin User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Access denied
 */
router.get(ADMIN_USER_GET_ALL_PREFIX, authenticate, getAllUsersAdmin);

// Admin create user
/**
 * @swagger
 * /v1.0.0/admin/users/create:
 *   post:
 *     summary: Admin - Create a new user with any role
 *     tags: [Admin User]
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
router.post(ADMIN_USER_CREATE_PREFIX, authenticate, createUserAsAdmin);

// Admin delete user
/**
 * @swagger
 * /v1.0.0/admin/users/{id}:
 *   delete:
 *     summary: Admin - Delete a user by ID
 *     tags: [Admin User]
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
router.delete(ADMIN_USER_DELETE_PREFIX, authenticate, deleteUserAsAdmin);

export default router;
