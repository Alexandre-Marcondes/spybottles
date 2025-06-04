// src/sessions/services/voiceService.ts

import { InventorySession } from '../models/sessionModel';
import { parseVoiceTranscript } from '../utils/voiceParserUtils';
import { updateInventorySession } from './sessionService';

/**
 * Adds a parsed voice entry to an existing session
 */
export const voiceAddToSessionService = async (
  userId: string,
  sessionId: string,
  transcript: string
): Promise<InventorySession> => {
  const {
    productId,
    quantity_full,
    quantity_partial,
    isTemp,
    suggestions,
    message,
  } = await parseVoiceTranscript(transcript, userId);

  if (!productId) {
    // Optional: log or handle suggestion feedback here
    throw new Error(
      suggestions?.length
        ? `${message} Suggestions: ${suggestions.join(', ')}`
        : 'Unable to identify product from speech.'
    );
  }

  const updatedSession = await updateInventorySession(sessionId, userId, {
    items: [
      {
        productId,
        quantity_full,
        quantity_partial,
        isTemp,
      },
    ],
  });

  if (!updatedSession) {
    throw new Error('Session not found or not owned by user');
  }

  return updatedSession;
};
