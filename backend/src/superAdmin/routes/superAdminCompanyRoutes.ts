import { Router } from 'express';
import { createCompanyAsSuperAdmin } from '../controllers/superAdminCompanyController';
import { authenticate } from '../../middleware/authMiddleware';
import { isSuperAdmin } from '../../utils/isSuperAdmin';


const router = Router();

/**
 * ✅ Only SuperAdmin can hit this
 * POST /v1.0.0/superAdmin/company/create
 */

/**
 * @swagger
 * /v1.0.0/superAdmin/company/create:
 *   post:
 *     summary: Create a new company (SuperAdmin only)
 *     tags:
 *       - SuperAdmin - Company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: Dominos Pizza Hawaii
 *     responses:
 *       201:
 *         description: Company successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 company:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     users:
 *                       type: array
 *                       items:
 *                         type: string
 *                     tier:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not a SuperAdmin
 *       400:
 *         description: Failed to create company
 */
router.post(
  '/company/create',
  authenticate,
  isSuperAdmin,
  createCompanyAsSuperAdmin
);

export default router;
