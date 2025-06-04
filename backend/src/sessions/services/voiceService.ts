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
    brand,
    variant,
  } = await parseVoiceTranscript(transcript, userId);

  if (!productId) {
    throw new Error(
      suggestions?.length
        ? `${message} Suggestions: ${suggestions.join(', ')}`
        : 'Unable to identify product from speech.'
    );
  }

  const displayName = variant ? `${brand} ${variant}` : brand;

  const updatedSession = await updateInventorySession(sessionId, userId, {
    items: [
      {
        productId,
        quantity_full,
        quantity_partial,
        isTemp,
        name: displayName, // 👈 inject human-readable product name
      },
    ],
  });

  if (!updatedSession) {
    throw new Error('Session not found or not owned by user');
  }

  return updatedSession;
};
