import { Router } from 'express';
import { resolveTempProduct } from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/adminAuthMiddleware';
import { RESOLVE_TEMP_PRODUCT_PREFIX } from '../adminConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/admin/resolve-temp-product:
 *   post:
 *     summary: Replace temp product ID with real product ID in all sessions
 *     tags: [Admin]
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
router.post(RESOLVE_TEMP_PRODUCT_PREFIX, authenticateAdmin, resolveTempProduct);

export default router;
