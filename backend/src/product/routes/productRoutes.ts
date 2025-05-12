import { authenticate } from '../../middleware/authMiddleware';
import { Router } from 'express';
import { 
  addProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchProducts,
} from '../controllers/productController';
import { validateRequest } from '../../middleware/validateRequest';
import  { productValidationSchema } from '../Validators/productValidator';
import {
  PRODUCT_ADD_PREFIX,
  PRODUCT_GET_ALL_PREFIX,
  PRODUCT_GET_ONE_PREFIX,
  PRODUCT_UPDATE_PREFIX,
  PRODUCT_DELETE_PREFIX,
  PRODUCT_SEARCH_PREFIX
} from '../productConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/product/add:
 *   post:
 *     summary: Create a new inventory product
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     description: User is inferred from token; do not include userID in the request body
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - category
 *               - quantity_full
 *               - location
 *             properties:
 *               brand:
 *                 type: string
 *                 example: "Absolut"
 *               variant:
 *                 type: string
 *                 example: "Mandrin"
 *               category:
 *                 type: string
 *                 enum: [wine, spirit, beer, other]
 *                 example: "spirit"
 *               varietal:
 *                 type: string
 *                 example: "Cabernet Sauvignon"
 *               vintage:
 *                 type: number
 *                 example: 2018
 *               size_ml:
 *                 type: number
 *                 default: 750
 *                 example: 1000
 *               unit:
 *                 type: string
 *                 example: "bottle"
 *               appellation:
 *                 type: string
 *                 example: "Bordeaux"
 *               country:
 *                 type: string
 *                 example: "France"
 *               quantity_full:
 *                 type: number
 *                 example: 2
 *               quantity_partial:
 *                 type: number
 *                 example: 0.5
 *               location:
 *                 type: string
 *                 example: "stock room"
 *               notes:
 *                 type: string
 *                 example: "Open bottle, moved from main bar"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error or bad request
 */
router.post(
  PRODUCT_ADD_PREFIX,
  authenticate, 
  validateRequest(productValidationSchema), 
  addProduct);

/**
 * @swagger
 * /v1.0.0/product/all:
 *   get:
 *     summary: Fetch all inventory products
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     description: User is inferred from token; do not include userID in the request body
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Optional category filter
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  PRODUCT_GET_ALL_PREFIX,
  authenticate,
  getAllProducts,
);

/**
 * @swagger
 * /v1.0.0/product/search:
 *   get:
 *     summary: Search for products by brand and/or variant
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         required: false
 *         description: Partial or full brand name
 *       - in: query
 *         name: variant
 *         schema:
 *           type: string
 *         required: false
 *         description: Partial or full variant name
 *     responses:
 *       200:
 *         description: List of matching products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing search parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(PRODUCT_SEARCH_PREFIX, authenticate, searchProducts);

/**
 * @swagger
 * /v1.0.0/product/{id}:
 *   get:
 *     summary: Fetch a single product by ID
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     description: User is inferred from token; do not include userID in the request body
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB _id of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get(
  PRODUCT_GET_ONE_PREFIX,
  authenticate,
  getProductById
);

/**
 * @swagger
 * /v1.0.0/product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     description: User is inferred from token; do not include userID in the request body
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB _id of the product
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial or full product data
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put(
  PRODUCT_UPDATE_PREFIX,
  authenticate,
  validateRequest(productValidationSchema),
  updateProductById,
);

/**
 * @swagger
 * /v1.0.0/product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     description: User is inferred from token; do not include userID in the request body
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete(
  PRODUCT_DELETE_PREFIX,
  authenticate,
  deleteProductById,
);

export default router;
