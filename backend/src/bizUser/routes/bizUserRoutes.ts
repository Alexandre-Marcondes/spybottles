import { Router } from 'express';
import { createBizUser } from '../controllers/bizUserController';
import { BIZ_USER_SIGNUP_PREFIX, BIZ_USER_TAG } from '../bizUserConstants';

const router = Router();
/**
 * @swagger
 * /v1.0.0/biz-user/sign-up:
 *   post:
 *     summary: Register a new company admin and create their associated company
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
 *                 format: email
 *                 example: mchinellato@restaurant.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePass123
 *               companyName:
 *                 type: string
 *                 example: M's Tiki Bar
 *     responses:
 *       201:
 *         description: ✅ Biz user and company created successfully
 *       400:
 *         description: 🚫 Validation failed – missing or invalid fields, or email already in use
 *       500:
 *         description: 🚫 Internal server error during signup
 */

router.post(BIZ_USER_SIGNUP_PREFIX, createBizUser); // ✅ No auth middleware here

export default router;
