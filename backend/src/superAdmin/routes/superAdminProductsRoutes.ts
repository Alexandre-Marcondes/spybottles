import { Router } from 'express';
import { resolveTempProduct } from '../controllers/superAdminController';
import { authenticate } from '../../middleware/authMiddleware';
import { isSuperAdmin } from '../../utils/isSuperAdmin';
import { SUPER_ADMIN_RESOLVE_TEMP_PRODUCT_PREFIX } from '../superAdminProductConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/superAdmin/products/resolve-temp-product:
 *   post:
 *     summary: Replace temp product ID with real product ID in all sessions
 *     tags: [Super Admin Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tempProductId
 *               - realProductId
 *             properties:
 *               tempProductId:
 *                 type: string
 *               realProductId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Temp product replaced
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post(SUPER_ADMIN_RESOLVE_TEMP_PRODUCT_PREFIX,
authenticate, isSuperAdmin, resolveTempProduct);

export default router;
