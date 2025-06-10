import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { restrictIfUnpaid } from '../../middleware/restrictIfUnpaid';
import { validateRequest } from '../../middleware/validateRequest';
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchProducts,
} from '../controllers/spiritsBeerProductController';
import { spiritsBeerProductValidationSchema } from '../Validators/spiritBeerProductValidator';
import {
  S_B_PRODUCT_ADD_PREFIX,
  S_B_PRODUCT_GET_ALL_PREFIX,
  S_B_PRODUCT_GET_ONE_PREFIX,
  S_B_PRODUCT_UPDATE_PREFIX,
  S_B_PRODUCT_DELETE_PREFIX,
  S_B_PRODUCT_SEARCH_PREFIX,
} from '../spiritsBeerproductConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/product/add:
 *   post:
 *     summary: Create a new spirits or beer product
 *     tags: [SpiritsBeerProduct]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - category
 *             properties:
 *               brand:
 *                 type: string
 *                 example: "Patrón"
 *               variant:
 *                 type: string
 *                 example: "Añejo"
 *               category:
 *                 type: string
 *                 enum: [spirits, beer]
 *                 example: "spirits"
 *               age:
 *                 type: number
 *                 example: 12
 *               cask:
 *                 type: string
 *                 example: "Sherry Cask"
 *               abv:
 *                 type: number
 *                 example: 40
 *               size_ml:
 *                 type: number
 *                 example: 750
 *               unit:
 *                 type: string
 *                 example: "bottle"
 *               country:
 *                 type: string
 *                 example: "Mexico"
 *               region:
 *                 type: string
 *                 example: "Jalisco"
 *               quantity_full:
 *                 type: number
 *                 example: 1
 *               quantity_partial:
 *                 type: number
 *                 example: 0.5
 *               location:
 *                 type: string
 *                 example: "well left"
 *               notes:
 *                 type: string
 *                 example: "Opened bottle, almost done"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  S_B_PRODUCT_ADD_PREFIX,
  authenticate,
  restrictIfUnpaid,
  validateRequest(spiritsBeerProductValidationSchema),
  addProduct
);

/**
 * @swagger
 * /v1.0.0/product/all:
 *   get:
 *     summary: Fetch all spirits/beer products
 *     tags: [SpiritsBeerProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Optional category filter
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   brand:
 *                     type: string
 *                   variant:
 *                     type: string
 *                   category:
 *                     type: string
 *                   age:
 *                     type: number
 *                   cask:
 *                     type: string
 *                   abv:
 *                     type: number
 *                   size_ml:
 *                     type: number
 *                   unit:
 *                     type: string
 *                   country:
 *                     type: string
 *                   region:
 *                     type: string
 *                   quantity_full:
 *                     type: number
 *                   quantity_partial:
 *                     type: number
 *                   location:
 *                     type: string
 *                   notes:
 *                     type: string
 */
router.get(S_B_PRODUCT_GET_ALL_PREFIX, authenticate, getAllProducts);

/**
 * @swagger
 * /v1.0.0/product/search:
 *   get:
 *     summary: Search spirits/beer by brand or variant
 *     tags: [SpiritsBeerProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: variant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get(S_B_PRODUCT_SEARCH_PREFIX, authenticate, searchProducts);

/**
 * @swagger
 * /v1.0.0/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [SpiritsBeerProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get(S_B_PRODUCT_GET_ONE_PREFIX, authenticate, getProductById);

/**
 * @swagger
 * /v1.0.0/product/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [SpiritsBeerProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Updated fields
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put(
  S_B_PRODUCT_UPDATE_PREFIX,
  authenticate,
  restrictIfUnpaid,
  validateRequest(spiritsBeerProductValidationSchema),
  updateProductById
);

/**
 * @swagger
 * /v1.0.0/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [SpiritsBeerProduct]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete(
  S_B_PRODUCT_DELETE_PREFIX,
  authenticate,
  restrictIfUnpaid,
  deleteProductById
);

export default router;
