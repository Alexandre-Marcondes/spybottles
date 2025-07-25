import { Router } from 'express';
import {
  createCompany,
  getCompanyById,
  updateCompany,
  inviteUserToCompany,
} from '../controllers/companyController';
import {
  COMPANY_CREATE_PREFIX,
  COMPANY_GET_ONE_PREFIX,
  COMPANY_UPDATE_PREFIX,
  COMPANY_INVITE_PREFIX,
} from '../companyConstants';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /v1.0.0/company/create:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
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
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Validation error
 */
router.post(COMPANY_CREATE_PREFIX, authenticate, createCompany);

/**
 * @swagger
 * /v1.0.0/company/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB company ID
 *     responses:
 *       200:
 *         description: Company data
 *       404:
 *         description: Company not found
 */
router.get(COMPANY_GET_ONE_PREFIX, authenticate, getCompanyById);

/**
 * @swagger
 * /v1.0.0/company/{id}:
 *   put:
 *     summary: Update company info (name, locations only)
 *     tags:
 *       - Company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successfully updated company
 *       400:
 *         description: Failed to update company
 *       403:
 *         description: Unauthorized
 */
router.put(COMPANY_UPDATE_PREFIX, authenticate, updateCompany);

/**
 * @swagger
 * /v1.0.0/company/{id}/invite:
 *   post:
 *     summary: Invite a user to a company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID to invite user to
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
 *         description: User invited
 *       400:
 *         description: Invalid input or already exists
 */
router.post(COMPANY_INVITE_PREFIX, authenticate, inviteUserToCompany);

export default router;
