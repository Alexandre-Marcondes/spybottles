// src/sessions/services/voiceService.ts
import { InventorySession } from '../models/sessionModel';
import { parseVoiceTranscript } from '../services/sessionService';
import { getSessionByIdService } from './sessionService';

/**
 * Adds a parsed voice entry to an existing session
 */
export const voiceAddToSessionService = async (
  userId: string,
  sessionId: string,
  transcript: string
): Promise<InventorySession> => {
  const parsed = await parseVoiceTranscript(transcript, userId);

  if (!parsed.productId) {
    throw new Error(
      parsed.suggestions?.length
        ? `${parsed.message} Suggestions: ${parsed.suggestions.join(', ')}`
        : 'Unable to identify product from speech.'
    );
  }
   console.log('🧪 parsed.brand:', parsed.brand);
console.log('🧪 parsed.variant:', parsed.variant);
console.log('🧪 parsed.quantity_full:', parsed.quantity_full);
console.log('🧪 parsed.quantity_partial:', parsed.quantity_partial);

  const displayName = parsed.variant ? `${parsed.brand} ${parsed.variant}` : parsed.brand;

  const session = await getSessionByIdService(sessionId, userId);
  if (!session) {
    throw new Error('Session not found or not owned by user');
  }

  session.items.push({
    productId: parsed.productId,
    quantity_full: parsed.quantity_full || 0,
    quantity_partial: parsed.quantity_partial || 0,
    isTemp: parsed.isTemp || false,
    name: displayName || '',
  });

  await session.save();
  return session;
};
