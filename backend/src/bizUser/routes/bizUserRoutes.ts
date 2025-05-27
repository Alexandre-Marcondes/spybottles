import { Router } from 'express';
import { createBizUser } from '../controllers/bizUserController';
import { BIZ_USER_SIGNUP_PREFIX, BIZ_USER_TAG } from '../bizUserConstants';

const router = Router();
/**
 * @swagger
 * /v1.0.0/biz-user/sign-up:
 *   post:
 *     summary: Register a new company admin (biz user) and create a company
 *     tags: [A Biz User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - companyName
 *             properties:
 *               email:
 *                 type: string
 *                 example: mchinellato@restaurant.com
 *               password:
 *                 type: string
 *                 example: securePass123
 *               companyName:
 *                 type: string
 *                 example: M's Tiki Bar
 *     responses:
 *       201:
 *         description: Biz user created successfully
 *       400:
 *         description: Missing or invalid fields
 */
router.post(BIZ_USER_SIGNUP_PREFIX, createBizUser); // ✅ No auth middleware here

export default router;
