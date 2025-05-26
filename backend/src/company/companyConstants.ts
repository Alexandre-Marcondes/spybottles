// API Version and Prefix
export const COMPANY_API_VERSION = '/v1.0.0';

export const COMPANY_PREFIX = '/company';
export const COMPANY_ROUTE = COMPANY_API_VERSION + COMPANY_PREFIX;

// Create a company
export const COMPANY_CREATE_PREFIX = '/create';
export const COMPANY_CREATE_PATH = COMPANY_ROUTE + COMPANY_CREATE_PREFIX;

// Get company by ID
export const COMPANY_GET_ONE_PREFIX = '/:id';
export const COMPANY_GET_ONE_PATH = COMPANY_ROUTE + COMPANY_GET_ONE_PREFIX;

// Update company
export const COMPANY_UPDATE_PREFIX = '/:id';
export const COMPANY_UPDATE_PATH = COMPANY_ROUTE + COMPANY_UPDATE_PREFIX;

// Invite a user to the company
export const COMPANY_INVITE_PREFIX = '/:id/invite';
export const COMPANY_INVITE_PATH = COMPANY_ROUTE + COMPANY_INVITE_PREFIX;

// Swagger tag
export const COMPANY_TAG = 'Company';
