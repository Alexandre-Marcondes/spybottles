// Admin API Version and Prefix
export const ADMIN_API_VERSION = '/v1.0.0';
export const ADMIN_PREFIX = '/admin';
export const ADMIN_ROUTE = ADMIN_API_VERSION + ADMIN_PREFIX;

// Admin User Routes
export const ADMIN_USER_PREFIX = '/users';
export const ADMIN_USER_ROUTE = ADMIN_ROUTE + ADMIN_USER_PREFIX;

export const ADMIN_USER_GET_ALL_PREFIX = '/';
export const ADMIN_USER_GET_ALL_PATH = ADMIN_USER_ROUTE + ADMIN_USER_GET_ALL_PREFIX;

export const ADMIN_USER_CREATE_PREFIX = '/create';
export const ADMIN_USER_CREATE_PATH = ADMIN_USER_ROUTE + ADMIN_USER_CREATE_PREFIX;

export const ADMIN_USER_DELETE_PREFIX = '/:id';
export const ADMIN_USER_DELETE_PATH = ADMIN_USER_ROUTE + ADMIN_USER_DELETE_PREFIX;

// Swagger Tag
export const ADMIN_USER_TAG = 'Admin User';
