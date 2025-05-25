import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import {
  createSelfPaidUser,
  updateOwnAccount,
  deleteOwnAccount,
  forgotPassword,
  resetPassword,
} from '../controllers/userController';

import {
  USER_SELF_CREATE_PREFIX,
  USER_SELF_UPDATE_PREFIX,
  USER_SELF_DELETE_PREFIX,
  USER_FORGOT_PASSWORD_PREFIX,
  USER_RESET_PASSWORD_PREFIX,
} from '../userConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/user/create:
 *   post:
 *     summary: Self-paid user signup
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 */
router.post(USER_SELF_CREATE_PREFIX, createSelfPaidUser);

/**
 * @swagger
 * /v1.0.0/user/me:
 *   put:
 *     summary: Update your own account
 *     tags: [User]
 *     security: 
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   long:
 *                     type: number
 *     responses:
 *       200:
 *         description: Account updated
 *       401:
 *         description: Unauthorized
 */
router.put(USER_SELF_UPDATE_PREFIX, authenticate, updateOwnAccount);

/**
 * @swagger
 * /v1.0.0/user/me:
 *   delete:
 *     summary: Delete your own account
 *     tags: [User]
 *     security: 
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 *       401:
 *         description: Unauthorized
 */
router.delete(USER_SELF_DELETE_PREFIX, authenticate, deleteOwnAccount);

/**
 * @swagger
 * /v1.0.0/user/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: If email exists, password reset is triggered
 */
router.post(USER_FORGOT_PASSWORD_PREFIX, forgotPassword);

/**
 * @swagger
 * /v1.0.0/user/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid token
 */
router.post(USER_RESET_PASSWORD_PREFIX, resetPassword);

export default router;
