import { Router } from 'express';
import { createBizUser } from '../controllers/bizUserController';
import { BIZ_USER_CREATE_PREFIX } from '../bizUserConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/biz-user/create:
 *   post:
 *     summary: Register a new company admin (biz user)
 *     tags: [Biz User]
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
 *               - phoneNumber
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
 *               phoneNumber:
 *                 type: string
 *                 example: "8085551234"
 *     responses:
 *       201:
 *         description: Biz user created successfully
 *       400:
 *         description: Missing or invalid fields
 */
router.post(BIZ_USER_CREATE_PREFIX, createBizUser);

export default router;
