// API Version and Base Prefix
export const USER_API_VERSION = '/v1.0.0';

export const USER_PREFIX = '/user';
export const USER_ROUTE = USER_API_VERSION + USER_PREFIX;

// Mongo CRUD User Routes
export const USER_CREATE_PREFIX = '/create';
export const USER_CREATE_PATH = USER_ROUTE + USER_CREATE_PREFIX;

export const USER_GET_ALL_PREFIX = '/all';
export const USER_GET_ALL_PATH = USER_ROUTE + USER_GET_ALL_PREFIX;

export const USER_GET_ONE_PREFIX = '/:id';
export const USER_GET_ONE_PATH = USER_ROUTE + USER_GET_ONE_PREFIX;

export const USER_UPDATE_PREFIX = '/:id';
export const USER_UPDATE_PATH = USER_ROUTE + USER_UPDATE_PREFIX;

export const USER_DELETE_PREFIX = '/:id';
export const USER_DELETE_PATH = USER_ROUTE + USER_DELETE_PREFIX;

// Swagger tag for grouping
export const USER_TAG = 'User';

// // API Version and Base Prefix
// export const USER_API_VERSION = '/v1.0.0';

// export const USER_PREFIX = '/user';
// export const USER_ROUTE = USER_API_VERSION + USER_PREFIX;

// // CRUD Route Prefixes
// export const USER_CREATE_PREFIX = '/create';
// export const USER_CREATE_PATH = USER_ROUTE + USER_CREATE_PREFIX;

// export const USER_GET_ALL_PREFIX = '/all';
// export const USER_GET_ALL_PATH = USER_ROUTE + USER_GET_ALL_PREFIX;

// export const USER_GET_ONE_PREFIX = '/:id';
// export const USER_GET_ONE_PATH = USER_ROUTE + USER_GET_ONE_PREFIX;

// export const USER_UPDATE_PREFIX = '/:id';
// export const USER_UPDATE_PATH = USER_ROUTE + USER_UPDATE_PREFIX;

// export const USER_DELETE_PREFIX = '/:id';
// export const USER_DELETE_PATH = USER_ROUTE + USER_DELETE_PREFIX;