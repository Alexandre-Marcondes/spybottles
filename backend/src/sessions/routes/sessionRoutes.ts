import { authenticate } from '../../middleware/authMiddleware';
import { restrictIfUnpaid } from '../../middleware/restrictIfUnpaid';
import { Router } from 'express';
import {
  startSession,
  getAllSessions,
  getSessionById,
  updateSessionById,
  deleteSessionById,
  finalizeSessionById,
  exportMonthlyInventory,
  parseVoiceInput,
  voiceAddToSession,
} from '../controllers/sessionController';

import {
  SESSION_START_PREFIX,
  SESSION_GET_ALL_PREFIX,
  SESSION_GET_ONE_PREFIX,
  SESSION_UPDATE_PREFIX,
  SESSION_DELETE_PREFIX,
  SESSION_FINALIZE_PREFIX,
  SESSION_EXPORT_PREFIX,
  SESSION_PARSE_VOICE_PREFIX,
  SESSION_VOICE_ADD_PREFIX,
} from '../sessionConstants';

const router = Router();

/**
 * @swagger
 * /v1.0.0/session/start:
 *   post:
 *     summary: Start a new inventory session
 *     tags:
 *       - Inventory Sessions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 description: Optional location of the session
 *               notes:
 *                 type: string
 *                 description: Optional notes
 *               items:
 *                 type: array
 *                 description: List of counted products
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity_full
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product counted
 *                     quantity_full:
 *                       type: number
 *                       description: Number of full units
 *                     quantity_partial:
 *                       type: number
 *                       description: Number of partial units (0–1)
 *               sessionLabel:
 *                 type: string
 *                 description: Optional label (e.g., “Stockroom”) to identify session
 *     responses:
 *       201:
 *         description: Inventory session started successfully
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post(SESSION_START_PREFIX,
  authenticate,
  restrictIfUnpaid,
  startSession);

  /**
 * @swagger
 * /v1.0.0/session/voice-parse:
 *   post:
 *     summary: Parse a voice transcript into product and quantity
 *     tags:
 *       - Inventory Sessions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transcript
 *             properties:
 *               transcript:
 *                 type: string
 *                 example: "Grey Goose point eight"
 *     responses:
 *       200:
 *         description: Parsed product and quantity
 *       400:
 *         description: Missing or invalid transcript
 */
router.post(SESSION_PARSE_VOICE_PREFIX,
  authenticate,
  restrictIfUnpaid,
  parseVoiceInput);

 /**
 * @swagger
 * /v1.0.0/session/{id}/voice-add:
 *   post:
 *     summary: Parse voice transcript and add/update item in a session
 *     tags:
 *       - Inventory Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transcript
 *             properties:
 *               transcript:
 *                 type: string
 *                 example: "Absolut Mandrin point five"
 *     responses:
 *       200:
 *         description: Item successfully parsed and added/updated in session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item added or updated from voice input"
 *                 data:
 *                   type: object
 *                   description: Updated session document
 *       400:
 *         description: No matching product found or invalid transcript
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session or product not found
 *       500:
 *         description: Server error
 */
router.post(SESSION_VOICE_ADD_PREFIX,
  authenticate, 
  restrictIfUnpaid, 
  voiceAddToSession)


/**
 * @swagger
 * /v1.0.0/session/all:
 *   get:
 *     summary: Get all inventory sessions for the logged-in user
 *     tags: [Inventory Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sessions
 *       401:
 *         description: Unauthorized
 */
router.get(SESSION_GET_ALL_PREFIX, authenticate, getAllSessions);

/**
 * @swagger
 * /v1.0.0/session/{id}:
 *   get:
 *     summary: Get a specific inventory session by ID
 *     tags: [Inventory Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to retrieve
 *     responses:
 *       200:
 *         description: Session found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.get(SESSION_GET_ONE_PREFIX, authenticate, getSessionById);

/**
 * @swagger
 * /v1.0.0/session/{id}:
 *   put:
 *     summary: Update an inventory session by ID
 *     tags:
 *       - Inventory Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial or full session update object
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.put(SESSION_UPDATE_PREFIX,
  authenticate,
  restrictIfUnpaid,
  updateSessionById);

  /**
 * @swagger
 * /v1.0.0/session/{id}/finalize:
 *   put:
 *     summary: Finalize an inventory session by ID
 *     tags:
 *       - Inventory Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID to finalize
 *     responses:
 *       200:
 *         description: Session finalized successfully
 *       400:
 *         description: Cannot finalize this session
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.put(SESSION_FINALIZE_PREFIX,
  authenticate,
  restrictIfUnpaid,
  finalizeSessionById);

/**
 * @swagger
 * /v1.0.0/session/{id}:
 *   delete:
 *     summary: Delete an inventory session by ID
 *     tags:
 *       - Inventory Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the session
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.delete(SESSION_DELETE_PREFIX,
  authenticate,
  restrictIfUnpaid,
  deleteSessionById);

  /**
 * @swagger
 * /v1.0.0/session/export:
 *   get:
 *     summary: Export finalized sessions for a given month to Excel
 *     tags:
 *       - Inventory Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periodTag
 *         required: false
 *         schema:
 *           type: string
 *         description: "Month to export (format: YYYY-MM). Defaults to current month."
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(SESSION_EXPORT_PREFIX,
  authenticate,
  restrictIfUnpaid,
  exportMonthlyInventory);

export default router;
