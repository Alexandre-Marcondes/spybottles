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

// ✅ GET all users
/**
 * @swagger
 * /v1.0.0/superAdmin/users:
 *   get:
 *     summary: SuperAdmin - Get all users
 *     tags: [Super Admin User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 */
router.get(SUPER_ADMIN_USER_GET_ALL_PREFIX, authenticate, isSuperAdmin, getAllUsersAdmin);

// ✅ POST: Create user (selfPaidUser or companyAdmin)
 /**
 * @swagger
 * /v1.0.0/superAdmin/users/create:
 *   post:
 *     summary: SuperAdmin - Create new user (selfPaid or companyAdmin)
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
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [selfPaidUser, companyAdmin]
 *               companyName:
 *                 type: string
 *                 description: Required if role is companyAdmin
 *     responses:
 *       201:
 *         description: User (and company if needed) created
 *       400:
 *         description: Bad input
 *       403:
 *         description: Unauthorized
 */
router.post(SUPER_ADMIN_USER_CREATE_PREFIX, authenticate, isSuperAdmin, createUserAsAdmin);

// ✅ DELETE user
/**
 * @swagger
 * /v1.0.0/superAdmin/users/{id}:
 *   delete:
 *     summary: SuperAdmin - Soft Delete user by ID
 *     description: Marks the user as inactive instead of deleting from database.
 *     tags: [Super Admin User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(SUPER_ADMIN_USER_DELETE_PREFIX, authenticate, isSuperAdmin, deleteUserAsAdmin);

export default router;
