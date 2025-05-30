import { InventorySession } from "../models/sessionModel";
import { 
  parseVoiceTranscript,
  updateInventorySession,
} from "./sessionService";


// src/sessions/services/voiceService.ts
export const voiceAddToSessionService = async (
  userId: string,
  sessionId: string,
  transcript: string
): Promise<InventorySession> => {
  const { productId, quantity_full, quantity_partial } = await parseVoiceTranscript(
    transcript,
    userId
  );

  const updatedSession = await updateInventorySession(sessionId, userId, {
    items: [
      { productId, quantity_full, quantity_partial },
    ],
  });

  if (!updatedSession) {
    throw new Error('Session not found or not owned by user');
  }

  return updatedSession;
};
