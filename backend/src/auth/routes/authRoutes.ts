import { Router } from 'express';
import { loginUser } from '../controllers/authController';
import { AUTH_LOGIN_PREFIX } from '../authConstants';

const router = Router();
/**
 * @swagger
 * /v1.0.0/auth/login:
 *   post:
 *     summary: Authenticate user and return JWT
 *     tags:
 *       - Auth
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
 *                 format: email
 *                 example: bob@solo.com
 *               password:
 *                 type: string
 *                 example: bob1
 *               companyId:
 *                 type: string
 *                 description: Optional if user belongs to only one company. Omit if selfpaid
 *                 example: 6651dfb17e3dd3d1d4a2222a
 *     responses:
 *       200:
 *         description: Successful login returns a token and user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     companies:
 *                       type: array
 *                       items:
 *                         type: string
 *                     currentCompany:
 *                       type: string
 *                     isSelfPaid:
 *                       type: boolean
 *                     isActive:
 *                       type: boolean
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

router.post(AUTH_LOGIN_PREFIX, loginUser);

export default router;
