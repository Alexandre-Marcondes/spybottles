// API version
export const SESSION_API_VERSION = '/v1.0.0';

// Route prefix
export const SESSION_PREFIX = '/session';
export const SESSION_ROUTE = SESSION_API_VERSION + SESSION_PREFIX;

// Specific action prefixes
export const SESSION_START_PREFIX = '/start';
export const SESSION_START_PATH = SESSION_ROUTE + SESSION_START_PREFIX;

export const SESSION_GET_ALL_PREFIX = '/all';
export const SESSION_GET_ALL_PATH = SESSION_ROUTE + SESSION_GET_ALL_PREFIX;

export const SESSION_GET_ONE_PREFIX = '/:id';
export const SESSION_GET_ONE_PATH = SESSION_ROUTE + SESSION_GET_ONE_PREFIX;

export const SESSION_UPDATE_PREFIX = '/:id';
export const SESSION_UPDATE_PATH = SESSION_ROUTE + SESSION_UPDATE_PREFIX;

export const SESSION_DELETE_PREFIX = '/:id';
export const SESSION_DELETE_PATH = SESSION_ROUTE + SESSION_DELETE_PREFIX;

export const SESSION_FINALIZE_PREFIX = '/:id/finalize';
export const SESSION_FINALIZE_PATH = SESSION_ROUTE + SESSION_FINALIZE_PREFIX;

export const SESSION_EXPORT_PREFIX = '/export';
export const SESSION_EXPORT_PATH = SESSION_ROUTE + SESSION_EXPORT_PREFIX;

export const SESSION_PARSE_VOICE_PREFIX = '/voice-parse';
export const SESSION_PARSE_VOICE_PATH =
  SESSION_ROUTE + SESSION_PARSE_VOICE_PREFIX;

export const SESSION_VOICE_ADD_PREFIX = '/:id/voice-add';
export const SESSION_VOICE_ADD_PATH = SESSION_ROUTE + SESSION_VOICE_ADD_PREFIX;

// ✅ Canonical definition
export interface ParseResult {
  productId: string;
  quantity_full: number;
  quantity_partial: number;
  isTemp?: boolean;
  suggestions?: string[];
  message?: string;
  brand?: string;
  variant?: string;
  category?: string;
}

  