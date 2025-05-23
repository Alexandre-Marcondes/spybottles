import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  forgotPassword,
  resetPassword, 
} from '../controllers/userController';

import {
    USER_CREATE_PREFIX,
    USER_GET_ALL_PREFIX,
    USER_GET_ONE_PREFIX,
    USER_UPDATE_PREFIX,
    USER_DELETE_PREFIX,
    USER_FORGOT_PASSWORD_PREFIX,
    USER_RESET_PASSWORD_PREFIX,
} from '../userConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/user/all:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get(USER_GET_ALL_PREFIX, getAllUsers);

/**
 * @swagger
 * /v1.0.0/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDb _id the user
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get(`${USER_GET_ONE_PREFIX}`, authenticate, getUserById);

/**
 * @swagger
 * /v1.0.0/user/create:
 *   post:
 *     summary: Create a new user
 *     tags: 
 *       - User
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
 *               - location
 *               - phoneNumber
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birthday:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [bartender, manager, admin]
 *               bizId:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   long:
 *                     type: number
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post(USER_CREATE_PREFIX, createUser);

/**
 * @swagger
 * /v1.0.0/user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - User
 *     security: 
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birthday:
 *                 type: string
 *               role:
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
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put(`${USER_UPDATE_PREFIX}`, authenticate, updateUserById);

/**
 * @swagger
 * /v1.0.0/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(`${USER_DELETE_PREFIX}`, authenticate, deleteUserById);

/**
 * @swagger
 * /v1.0.0/user/forgot-password:
 *   post:
 *     summary: Request a password reset link via email
 *     tags:
 *       - User
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
 *         description: Password reset email sent if user exists
 *       400:
 *         description: Invalid email format or missing field
 */
router.post(USER_FORGOT_PASSWORD_PREFIX, forgotPassword);


/**
 * @swagger
 * /v1.0.0/user/reset-password:
 *   post:
 *     summary: Reset user password with token
 *     tags:
 *       - User
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
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post(USER_RESET_PASSWORD_PREFIX, resetPassword);


export default router;