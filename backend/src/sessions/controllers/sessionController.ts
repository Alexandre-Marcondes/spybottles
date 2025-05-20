import { Request, Response } from 'express';
import {
  createInventorySession,
  getSessionsByUser,
  getSessionByIdService,
  updateInventorySession,
  deleteInventorySession,
  exportSessionsToExcel,
  parseVoiceTranscript,
} from '../services/sessionService';
import InventorySessionModel, { SessionStatus } from '../models/sessionModel';
import { inventorySessionSchema } from '../validators/sessionValidator';

/**
 * Controller to start a new inventory session
 */
export const startSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: 'Unauthorized: Missing userId in token' });
      return;
    }
    console.log('+++++++Auth:', req.headers.authorization);
    console.log('+++++++Body:', req.body);

    const { error, value } = inventorySessionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map((d) => d.message),
      });
      return;
    }

    const userId = req.user.userId;
    const { location, notes, items, sessionLabel } = value;

    // 🔧 Auto-generate periodTag from current date
    const now = new Date();
    const periodTag = now.toISOString().slice(0, 7); // "YYYY-MM"

    // ✅ Build session data
    const sessionData = {
      userId,
      location,
      notes,
      items,
      sessionLabel,
      periodTag,
      status: SessionStatus.ACTIVE,
      startedAt: now,
    };

    const session = await createInventorySession(sessionData);

    res.status(201).json({
      message: 'Inventory session started',
      session,
    });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ message: 'Server error starting session' });
  }
};

// src/sessions/controllers/sessionController.ts
// export const getAllSessions = async (
//   req: Request, 
//   res: Response,
// ): Promise<void> => {
//   try {
//     const userId = req.user?.userId;

//     if (!userId) {
//        res.status(401).json({ message: 'Unauthorized' });
//        return;
//     }

//     const sessions = await getSessionsByUser(userId);

//     res.status(200).json({ data: sessions });
//   } catch (error) {
//     console.error('Error fetching sessions:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
export const getAllSessions = async (
  req: Request, 
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    console.log('+++++++Auth:', req.headers.authorization);
    console.log('+++++++Body:', req.body);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // ✅ Extract optional filters
    const { status, periodTag } = req.query;

    const filters: Record<string, any> = { userId };

    if (status && typeof status === 'string') {
      filters.status = status;
    }

    if (periodTag && typeof periodTag === 'string') {
      filters.periodTag = periodTag;
    }

    const sessions = await getSessionsByUser(filters);

    res.status(200).json({ data: sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getSessionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const session = await getSessionByIdService(sessionId, userId);

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    res.status(200).json({ data: session });
  } catch (error) {
    console.error('Error getting session by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const updateSessionById = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const userId = req.user?.userId;
//     const sessionId = req.params.id;

//     if (!userId) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return;
//     }

//     const updates = req.body;

//     const updatedSession = await updateInventorySession(sessionId, userId, updates);

//     if (!updatedSession) {
//       res.status(404).json({ message: 'Session not found or not owned by user' });
//       return;
//     }

//     res.status(200).json({
//       message: 'Session updated successfully',
//       data: updatedSession,
//     });
//   } catch (error) {
//     console.error('Error updating session:', error);
//     res.status(500).json({ message: 'Server error updating session' });
//   }
// };
export const updateSessionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 🔍 First: get the existing session
    const existingSession = await InventorySessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!existingSession) {
      res.status(404).json({ message: 'Session not found or not owned by user' });
      return;
    }

    if (existingSession.status === SessionStatus.FINALIZED) {
      res.status(400).json({ message: 'Cannot update a finalized session' });
      return;
    }

    // 🛠 Proceed with update
    const updates = req.body;

    const updatedSession = await updateInventorySession(sessionId, userId, updates);

    res.status(200).json({
      message: 'Session updated successfully',
      data: updatedSession,
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Server error updating session' });
  }
};


/**
 * Controller to delete an inventory session by ID
 */
// export const deleteSessionById = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const userId = req.user?.userId;
//     const sessionId = req.params.id;

//     if (!userId) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return;
//     }

//     const deleted = await deleteInventorySession(sessionId, userId);

//     if (!deleted) {
//       res.status(404).json({ message: 'Session not found or not owned by user' });
//       return;
//     }

//     res.status(200).json({ message: 'Session deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting session:', error);
//     res.status(500).json({ message: 'Server error deleting session' });
//   }
// };

export const deleteSessionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const session = await InventorySessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found or not owned by user' });
      return;
    }

    if (session.status === SessionStatus.FINALIZED) {
      res.status(400).json({ message: 'Cannot delete a finalized session' });
      return;
    }

    const deleted = await InventorySessionModel.deleteOne({
      _id: sessionId,
      userId,
    });

    if (deleted.deletedCount !== 1) {
      res.status(500).json({ message: 'Failed to delete session' });
      return;
    }

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Server error deleting session' });
    
  }
};

export const finalizeSessionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const session = await InventorySessionModel.findOne({ _id: sessionId, userId });

    if (!session) {
      res.status(404).json({ message: 'Session not found or not owned by user' });
      return;
    }

    if (session.status === SessionStatus.FINALIZED) {
      res.status(400).json({ message: 'Session is already finalized' });
      return;
    }

    session.status = SessionStatus.FINALIZED;
    session.finalizedAt = new Date();
    await session.save();

    res.status(200).json({
      message: 'Session finalized successfully',
      data: session,
    });
  } catch (error) {
    console.error("❌ Finalize error:", error);
    res.status(500).json({ message: 'Server error finalizing session' });
  }
};

export const exportMonthlyInventory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const periodTag = typeof req.query.periodTag === 'string'
      ? req.query.periodTag
      : new Date().toISOString().slice(0, 7); // Default to current month

    const buffer = await exportSessionsToExcel(userId, periodTag);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventory_${periodTag}.xlsx`);
    res.status(200).end(buffer);
  } catch (error) {
    console.error('❌ Excel Export Error:', error);
    console.error('Error exporting inventory:', error);
    res.status(500).json({ message: 'Error exporting inventory to Excel' });
  }
};

/**
 * Controller: Parse a transcript into product + quantity
 */
export const parseVoiceInput = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { transcript } = req.body;

    if (!userId || !transcript || typeof transcript !== 'string') {
      res.status(400).json({ message: 'Invalid request: missing transcript or userId' });
      return;
    }

    const result = await parseVoiceTranscript(transcript, userId);

    res.status(200).json({
      message: 'Parsed successfully',
      data: result, // includes productId, quantity_full, quantity_partial
    });
  } catch (error: any) {
    if (error.message === 'No matching product found') {
      res.status(404).json({ message: 'No matching product found' });
    } else {
      console.error('❌ Voice parsing failed:', error);
      res.status(500).json({ message: 'Server error parsing transcript' });
    }
  }
};

/**
 * Controller: Parse voice and update session items
 */
export const voiceAddToSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.params.id;
    const { transcript } = req.body;

    if (!userId || !sessionId || !transcript || typeof transcript !== 'string') {
      res.status(400).json({ message: 'Invalid request: sessionId or transcript missing' });
      return;
    }

    // 🔍 Extract product + quantities
    const { productId, quantity_full, quantity_partial } = await parseVoiceTranscript(
      transcript,
      userId
    );

    // ⚙️ Call update service with the parsed item
    const updatedSession = await updateInventorySession(sessionId, userId, {
      items: [
        {
          productId,
          quantity_full,
          quantity_partial,
        },
      ],
    });

    if (!updatedSession) {
      res.status(404).json({ message: 'Session not found or not owned by user' });
      return;
    }

    res.status(200).json({
      message: 'Item added or updated from voice input',
      data: updatedSession,
    });
  } catch (error: any) {
    if (error.message === 'No matching product found') {
      res.status(404).json({ message: 'No matching product found in database' });
    } else {
      console.error('❌ voiceAddToSession error:', error);
      res.status(500).json({ message: 'Server error during voice-based session update' });
    }
  }
};

