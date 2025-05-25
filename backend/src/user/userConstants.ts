// API Version and Base Prefix
export const USER_API_VERSION = '/v1.0.0';

export const USER_PREFIX = '/user';
export const USER_ROUTE = USER_API_VERSION + USER_PREFIX;

// Mongo Create self User Routes
export const USER_SELF_CREATE_PREFIX = '/create';
export const USER_SELF_CREATE_PATH = USER_ROUTE + USER_SELF_CREATE_PREFIX;

// Delete yourself 
export const USER_SELF_DELETE_PREFIX = '/me';
export const USER_SELF_DELETE_PATH = USER_ROUTE + USER_SELF_DELETE_PREFIX;

export const USER_SELF_UPDATE_PREFIX = '/me';
export const USER_SELF_UPDATE_PATH = USER_ROUTE + USER_SELF_UPDATE_PREFIX;

// Swagger tag for grouping
export const USER_TAG = 'User';

// Forgot Password & Reset Password Routes
export const USER_FORGOT_PASSWORD_PREFIX = '/forgot-password';
export const USER_FORGOT_PASSWORD_PATH =
  USER_ROUTE + USER_FORGOT_PASSWORD_PREFIX;

export const USER_RESET_PASSWORD_PREFIX = '/reset-password';
export const USER_RESET_PASSWORD_PATH =
  USER_ROUTE + USER_RESET_PASSWORD_PREFIX;
